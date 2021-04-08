/**
 * Handles GET requests for attachments stored in S3
 */
const express = require('express')
const router = new express.Router()
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')

const attachmentPrefix = 'ATTACHMENT/'
const bucketName = 'contactlite-email'

/**
 * Retrieves an attachment. 
 */
router.get('/attachments/:key', async (req, res) => {
    try {
        // Send a message to S3 to retrieve the attachment
        const S3 = new S3Client({ region: "us-west-2" });
        const params = {
            Bucket: bucketName,
            Key: attachmentPrefix + req.params.key
        }
        const command = new GetObjectCommand(params)
        const response = await S3.send(command);

        if (response) {
            const { ContentLength, ContentType } = response
            const fileName = response.Metadata.filename
            const body = await streamToBuffer(response.Body)
            
            res.append('Content-Type', ContentType)
            res.append('Content-Length', ContentLength)
            res.send(body)
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
 * Creates a string from the stream
 */
const streamToBuffer = async (stream) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    })
}

module.exports = router