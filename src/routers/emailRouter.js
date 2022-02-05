/**
 * Services email requests from the client, and email notifications from the AWS 
 * Simple Notification System. Newly received emails are also pushed to the client 
 */
const express = require('express')
const axios = require('axios')
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const { v4: uuidv4 } = require('uuid');

const Email = require('../models/email')
const Person = require('../models/person')
const Encounter = require('../models/encounter')
const parseEmail = require('../services/parser')

const webSocketManager = require('../services/webSocketManager')

const router = new express.Router()

const ATTACHMENT_PREFIX = process.env.CL_EMAIL_ATTACHMENT_PREFIX
const BUCKET_NAME = process.env.CL_EMAIL_BUCKET_NAME

/**
 * Processes email receipt notifications. If the 
 * @return the new Email document with code 201 Created
 */
router.post('/emails', async (req, res) => {

    const notification = req.body;

    if (notification.Type === 'SubscriptionConfirmation'){
        // A SubscriptionConfirmation request is sent by SNS to confirm willingness
        // to receive events from SNS. Rather than just responding OK, SNS requires
        // confirmation by issiuing a GET to a provided URL
        const subscribeURL = notification.SubscribeURL;
        console.log('Responding to AWS SNS confirmation request\n' + subscribeURL);
        axios.get(subscribeURL)
        .then(() => {
            // Respond to original request
            res.status(200).send()
        })
        .catch((e) => {
            console.log('ERROR responding to confirmation request: ' + e)
            res.status(400).send()
        })
    }
    else if (notification.Type === 'Notification'){
        // Notifications include changes to the SNS configuration such as changing the S3 object id prefix
        // In such cases the notification Subject is 'Amazon SES Email Receipt Subscription Notification'
        // For normal emails, notification Subject is 'Amazon SES Email Receipt Notification'
        if (notification.Subject === 'Amazon SES Email Receipt Subscription Notification'){
            console.log('Received Receipt Subscription Notifiction')
            res.status(200).send()
        }
        else if (notification.Subject === 'Amazon SES Email Receipt Notification'){
            const message = JSON.parse(notification.Message)
            const bucketName = message.receipt.action.bucketName
            const objectKey = message.receipt.action.objectKey;

            try {
                // Send a message to S3 to retrieve the "raw" message from the S3 bucket
                const S3 = new S3Client({ region: "us-west-2" });
                const params = {
                    Bucket: bucketName,
                    Key: objectKey
                }
                const command = new GetObjectCommand(params)
                const response = await S3.send(command);
                
                // Parse and extract required fields
                const emailFields = await parseEmail(response.Body)

                // Look for the Person who sent it
                const sender = await findSender(emailFields)
                emailFields.sender = sender ? sender._id : null
                console.log(sender ? `Received email from ${sender.name}` : `Received email from unknown address ${emailFields.from}`)

                if (emailFields.attachments){
                    emailFields.attachments = await saveAttachments(emailFields.attachments, S3)
                }

                // Create an Email entity in the database
                const email = new Email(emailFields)
                await email.save()
                // Push it to the client
                webSocketManager.pushToClient('email', email)
               
                // If a sender Person was found, create an Encounter 
                if (sender){
                    const encounter = new Encounter({
                        person: sender._id,
                        when:   email.date,
                        type:   'email',
                        email:  email._id 
                    })
                    await encounter.save()
                    // Push it to the client
                    webSocketManager.pushToClient('encounter', encounter)
                }
               
                res.status(200).send()
            } 
            catch (err) {
                console.error(err);
                res.status(400).send()
            }
        }
    }
})

/**
 * Saves the attachments to S3 
 */
const saveAttachments = async (attachments, S3) => {

    for (let i = 0; i < attachments.length; i++){
        let attachment = attachments[i]; 
        const { fileName, contentType, content } = attachment;
        const params = {
            Bucket:         BUCKET_NAME,
            Key:            ATTACHMENT_PREFIX + uuidv4(),
            Body:           content,
            ContentType:    contentType,
            Metadata:       {fileName}
        }
        const command = new PutObjectCommand(params)
        const response = await S3.send(command)
        console.log('Saved file ' + fileName)
        
        // Replace the attachment fields
        attachments[i] = {bucket: params.Bucket, key: params.Key, fileName, contentType}
    }
    return new Promise((resolve, reject) => {
        resolve(attachments)
    })
}

// Find the Person entity of the sender and add it to the email 
const findSender = async emailFields => {
    const senderEmail = emailFields.from[0].address;
    const person = await Person.findOne({email: senderEmail})
    return new Promise((resolve, reject) => {
        resolve(person)
    })
}


/**
 * Gets all Email documents or those of a single Person, signified
 * by a'person' query parameter
 */
router.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find({})
        res.send(emails)
    } 
    catch (e) {
        res.status(500).send()
    }
})

/**
 * Gets the Email specified by an ObjectId value
 */
router.get('/emails/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const email = await Email.findById(_id)

        if (email) {
            res.send(email)
        }
        else {
            res.status(404).send()
        }
    } 
    catch (e) {
        res.status(500).send()
    }
})

/**
 * Updates the Email specified by the id path parameter with the values in the request body,
 * and returns the updated Email 
 */
router.put('/emails/:id', async (req, res) => {
    try {
        const email = await Email.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (email) {
            res.send(email)
        }
        else {
            res.status(404).send()
        }
    } 
    catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Deletes the Email specified by the id path parameter
 */
router.delete('/emails/:id', async (req, res) => {
    try {
        const email = await Email.findByIdAndDelete(req.params.id)

        if (email) {
            res.send(email)
        }
        else {
            res.status(404).send()
        }
    } 
    catch (e) {
        res.status(500).send()
    }
})

module.exports = router