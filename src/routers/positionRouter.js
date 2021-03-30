/**
 * Handles requests for Positions
 */
const express = require('express')
const Position = require('../models/position')
const router = new express.Router()

/**
 * Creates a new Position.
 * @return the new Position document with code 201 Created
 */
router.post('/positions', async (req, res) => {
    const position = new Position(req.body)

    try {
        await position.save()
        res.status(201).send(position)
    } 
    catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Gets all Position documents
 */
router.get('/positions', async (req, res) => {
    try {
        const positions = await Position.find({})
        res.send(positions)
    } 
    catch (e) {
        res.status(500).send()
    }
})

/**
 * Gets the Position specified by an ObjectId value
 */
router.get('/positions/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const position = await Position.findById(_id)

        if (position) {
            res.send(position)
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
 * Updates the Position specified by the id path parameter with the values in the request body,
 * and returns the updated Position 
 */
router.put('/positions/:id', async (req, res) => {
    try {
        const position = await Position.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (position) {
            res.send(position)
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
 * Deletes the Position specified by the id path parameter
 */
router.delete('/positions/:id', async (req, res) => {
    try {
        const position = await Position.findByIdAndDelete(req.params.id)

        if (position) {
            res.send(position)
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