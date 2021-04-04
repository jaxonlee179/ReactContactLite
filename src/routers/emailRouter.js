/**
 * Processes email receipt notifications from SNS and serves email content to the client.
 */
const express = require('express')
const axios = require('axios')
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const { v4: uuidv4 } = require('uuid');

const Email = require('../models/email')
const Person = require('../models/person')
const Encounter = require('../models/encounter')
const parseEmail = require('../services/parser')

const router = new express.Router()

const CR_FROM = 'contactlite@softart-consulting.com'
const CR_TO = 'robert.t.toms@gmail.com'
const CR_SUBJECT = 'AWS Subscription Confirmation Request'

/**
 * Processes email receipt notifications. If the 
 * @return the new Email document with code 201 Created
 */
router.post('/emails', async (req, res) => {

    const notification = req.body;

    if (notification.Type === 'SubscriptionConfirmation'){
        // A SubscriptionConfirmation request is sent by SNS to confirm willingness
        // to receive events from SNS. 
        const subscribeURL = notification.SubscribeURL;
        axios.get(subscribeURL)
        .then(() => {
            console.log('Responding to AWS SNS confirmation request\n' + subscribeURL);
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
                console.log(emailFields);
                
                
                // if (emailFields.attachments){
                //     emailFields.attachments = await saveAttachments(emailFields.attachments, S3)
                // }
                // // Create an Email entity in the database
                // const email = new Email(emailFields)
                // // Link it to Person who sent it
                // linkEmailToPerson(email)
                // await email.save()
               
                // // Create an Encounter 
                // const encounter = new Encounter({
                //     person: email.sender,
                //     when:   email.date,
                //     type:   'email',
                //     email:  email._id 
                // })
                // await encounter.save()
               
                // res.status(200).send()
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
            Bucket:         'contactlite-email',
            Key:            'ATTACHMENT/' + uuidv4(),
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

// Find the Person entity of the sender and link the Email to it 
const linkEmailToPerson = async email => {
    const senderEmail = email.from.address;
    const person = await Person.findOne({email: senderEmail})
    email.sender = person._id
    return new Promise((resolve, reject) => {
        resolve(email)
    })
}


/**
 * Gets all Email documents or those of a single Person, signified
 * by a'person' query parameter
 */
router.get('/emails', async (req, res) => {
    try {
//        const query = req.query.person ? {
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