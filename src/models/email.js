/**
 * 
 */
const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
    from:       String,
    to:         [String],
    date:       Date,
    subject:    String,
    text:       String,
    attachments:[{bucket: String, key: String, contentType: String}]
}, {
    timestamps: true
})

const Email = mongoose.model('Email', emailSchema)

module.exports = Email