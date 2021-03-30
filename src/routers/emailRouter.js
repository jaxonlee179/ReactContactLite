/**
 * Processes email receipt notifications from SNS and serves email content to the client.
 */
const express = require('express')
const axios = require('axios')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
//const { createWriteStream } = require('fs-extra');

// For fs docs, see: https://www.npmjs.com/package/fs-extra
// Solution to fetch described here: https://github.com/aws/aws-sdk-js-v3/issues/1096 (Thanks AM. Changed from v2 to v3 without clarity)


const Email = require('../models/email')
//const { sendSimple } = require('../services/mailSender')
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
            // Nothing
        }
        else if (notification.Subject === 'Amazon SES Email Receipt Notification'){
            const message = JSON.parse(notification.Message)
            const bucketName = message.receipt.action.bucketName
            const objectKey = message.receipt.action.objectKey;

            // Retrieve the "raw" message from the S3 bucket
            const client = new S3Client({ region: "us-west-2" });
            const params = {
                Bucket: bucketName,
                Key: objectKey
            }
            try {
                const command = new GetObjectCommand(params)
                const response = await client.send(command);
                const email = parseEmail(response.Body)
            } 
            catch (err) {
                console.error(err);
            }
        }
    }
})


/**
 * Gets all Email documents
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