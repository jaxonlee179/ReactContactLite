/**
 * Handles login requests
 */
const express = require('express')
const router = new express.Router()
const SHA256 = require("crypto-js/sha256");
const CryptoJS = require("crypto-js");

const User = require('../models/user')

/**
 * Validates a password
 */
router.post('/login', async (req, res) => {
    const password = (req.body).password;
    const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64)
    
    try {
        const user = await User.find({password: hash})
        res.status(user && user.length > 0 ? 200 : 401).send()
    } 
    catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router