/**
 * Handles requests for appointments
 */
const express = require('express')
const Appointment = require('../models/appointment')
const router = new express.Router()

/**
 * Creates a new appointment.
 * @return the new Appointment document with code 201 Created
 */
router.post('/appointments', async (req, res) => {
    const appointment = new Appointment(req.body)

    try {
        await appointment.save()
        res.status(201).send(appointment)
    } 
    catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Gets all Appointment documents
 */
router.get('/appointments', async (req, res) => {
    try {
        let appointments = await Appointment.find({})
        if (!appointments) {
            appointments = []
        }
        res.send(appointments)
    } 
    catch (e) {
        res.status(500).send()
    }
})

/**
 * Gets the Appointment specified by an ObjectId value
 */
router.get('/appointments/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const appointment = await Appointment.findById(_id)

        if (appointment) {
            res.send(appointment)
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
 * Updates the Appointment specified by the id path parameter with the values in the request body,
 * and returns the updated Appointment 
 */
router.put('/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (appointment) {
            res.send(appointment)
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
 * Deletes the Appointment specified by the id path parameter
 */
router.delete('/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id)

        if (appointment) {
            res.send(appointment)
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