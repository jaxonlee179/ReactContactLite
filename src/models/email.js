/**
 * 
 */
const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
    from:       [{name: String, address: String}],
    to:         [{name: String, address: String}],
    subject:    String,
    text:       String,
    attachments:[{bucket: String, key: String, fileName: String, contentType: String}]
}, {
    timestamps: true
})

const Email = mongoose.model('Email', emailSchema)

module.exports = Email