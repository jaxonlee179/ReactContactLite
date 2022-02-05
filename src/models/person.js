/**
 * A Person 
 */
const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name:       {type: String, required: true},
    email:      {type: String, default: ''},
    phone:      {type: String, default: ''},
    company:    {type: mongoose.ObjectId},
    linkedIn:   {type: String, default: ''},
    hide:       {type: Boolean, default: false}
}, {
    timestamps: true
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person

