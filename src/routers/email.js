/**
 * Handles requests for Emails
 */
const express = require('express')
const Email = require('../models/email')
const router = new express.Router()

/**
 * Creates a new Email.
 * @return the new Email document with code 201 Created
 */
router.post('/emails', async (req, res) => {
    const email = new Email(req.body)

    try {
        await email.save()
        res.status(201).send(email)
    } 
    catch (e) {
        res.status(400).send(e)
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