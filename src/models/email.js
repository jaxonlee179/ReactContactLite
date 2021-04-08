/**
 * 
 */
const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
    date:       Date,
    from:       [{name: String, address: String}],
    to:         [{name: String, address: String}],
    cc:         [{name: String, address: String}],
    bcc:        [{name: String, address: String}],
    subject:    String,
    text:       String,
    attachments:[{bucket: String, key: String, fileName: String, contentType: String}],
    sender:     {type: mongoose.ObjectId}
}, {
    timestamps: true
})

const Email = mongoose.model('Email', emailSchema)

module.exports = Email