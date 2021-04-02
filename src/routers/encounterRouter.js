/**
 * Handles requests for Encounters
 */
const express = require('express')
const Encounter = require('../models/encounter')
const router = new express.Router()

/**
 * Creates a new Encounter.
 * @return the new Encounter document with code 201 Created
 */
router.post('/encounters', async (req, res) => {
    const encounter = new Encounter(req.body)

    try {
        await encounter.save()
        res.status(201).send(encounter)
    } 
    catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Gets all Encounter documents
 */
router.get('/encounters', async (req, res) => {
    try {
        const encounters = await Encounter.find({})
        res.send(encounters)
    } 
    catch (e) {
        res.status(500).send()
    }
})

/**
 * Gets the Encounter specified by an ObjectId value
 */
router.get('/encounters/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const encounter = await Encounter.findById(_id)

        if (encounter) {
            res.send(encounter)
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
 * Updates the Encounter specified by the id path parameter with the values in the request body,
 * and returns the updated Encounter 
 */
router.put('/encounters/:id', async (req, res) => {
    try {
        const encounter = await Encounter.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (encounter) {
            res.send(encounter)
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
 * Deletes the Encounter specified by the id path parameter
 */
router.delete('/encounters/:id', async (req, res) => {
    try {
        const encounter = await Encounter.findByIdAndDelete(req.params.id)

        if (encounter) {
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