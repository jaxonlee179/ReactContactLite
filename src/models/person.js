/**
 * An Person is typed as either a recruiter or an "enterprise" (public or private)
 */
const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name:       {type: String, required: true},
    email:      {type: String, default: ''},
    phone:      {type: String, default: ''},
    company:    {type: mongoose.ObjectId},
}, {
    timestamps: true
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person

