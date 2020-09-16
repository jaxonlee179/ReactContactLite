/**
 * An Person is typed as either a recruiter or an "enterprise" (public or private)
 */
const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
    sender:     {type: String},
    receiver:   {type: String},
    date:       {type: Date},
    subject:    {type: String},
    body:       {type: String}
}, {
    timestamps: true
})

const Email = mongoose.model('Email', emailSchema)

module.exports = Email