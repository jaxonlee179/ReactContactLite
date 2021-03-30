/**
 * Handles requests for Persons
 */
const express = require('express')
const Person = require('../models/person')
const router = new express.Router()

/**
 * Creates a new Person.
 * @return the new Person document with code 201 Created
 */
router.post('/persons', async (req, res) => {
    const person = new Person(req.body)

    try {
        await person.save()
        res.status(201).send(person)
    } 
    catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Gets all Person documents
 */
router.get('/persons', async (req, res) => {
    try {
        const persons = await Person.find({})
        res.send(persons)
    } 
    catch (e) {
        res.status(500).send()
    }
})

/**
 * Gets the Person specified by an ObjectId value
 */
router.get('/persons/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const person = await Person.findById(_id)

        if (person) {
            res.send(person)
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
 * Updates the Person specified by the id path parameter with the values in the request body,
 * and returns the updated Person 
 */
router.put('/persons/:id', async (req, res) => {
    try {
        const person = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (person) {
            res.send(person)
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
 * Deletes the person specified by the id path parameter
 */
router.delete('/persons/:id', async (req, res) => {
    try {
        const person = await person.findByIdAndDelete(req.params.id)

        if (person) {
            res.send(person)
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