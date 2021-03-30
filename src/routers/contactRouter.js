/**
 * Handles requests for Contacts
 */
const express = require('express')
const Contact = require('../models/contact')
const router = new express.Router()

/**
 * Creates a new Contact.
 * @return the new Contact document with code 201 Created
 */
router.post('/contacts', async (req, res) => {
    const contact = new Contact(req.body)

    try {
        await contact.save()
        res.status(201).send(contact)
    } 
    catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Gets all Contact documents
 */
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find({})
        res.send(contacts)
    } 
    catch (e) {
        res.status(500).send()
    }
})

/**
 * Gets the Contact specified by an ObjectId value
 */
router.get('/contacts/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const contact = await Contact.findById(_id)

        if (contact) {
            res.send(contact)
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
 * Updates the Contact specified by the id path parameter with the values in the request body,
 * and returns the updated Contact 
 */
router.put('/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (contact) {
            res.send(contact)
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
 * Deletes the Contact specified by the id path parameter
 */
router.delete('/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id)

        if (contact) {
            res.send(xxx)
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