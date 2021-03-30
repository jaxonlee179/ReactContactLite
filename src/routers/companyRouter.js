/**
 * Handles requests for Companies
 */
const express = require('express')
const  Company = require('../models/company')
const router = new express.Router()

/**
 * Creates a new Company.
 * @return the new Company document with code 201 Created
 */
router.post('/companies', async (req, res) => {
    const company = new Company(req.body)

    try {
        await company.save()
        res.status(201).send(company)
    } 
    catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Gets all Company documents
 */
router.get('/companies', async (req, res) => {
    try {
        const companies = await Company.find({})
        res.send(companies)
    } 
    catch (e) {
        res.status(500).send()
    }
})

/**
 * Gets the Company specified by an ObjectId value
 */
router.get('/companies/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const company = await Company.findById(_id)

        if (company) {
            res.send(company)
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
 * Updates the Company specified by the id path parameter with the values in the request body,
 * and returns the updated Company 
 */
router.put('/companies/:id', async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (company) {
            res.send(company)
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
 * Deletes the Company specified by the id path parameter
 */
router.delete('/companies/:id', async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id)

        if (company) {
            res.send(company)
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