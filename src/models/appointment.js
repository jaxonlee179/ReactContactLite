/**
 * An Appointment records an intent to meet with a Person 
 * associated with a Company to discuss a Position
 */
const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    company:    {type: mongoose.ObjectId},
    person:     {type: mongoose.ObjectId},
    position:   {type: mongoose.ObjectId},
    when:       {type: Date, required: true}
}, {
    timestamps: true
})

const Appointment = mongoose.model('Appointment',appointmentSchema)

module.exports = Appointment