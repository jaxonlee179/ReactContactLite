/**
 * An Encounter records an email (received or sent) or a phone conversation with a Person about a Position.
 * For an email contact, the email ObjectId value is set. Otherwise the details value describes the conversation
 */
const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const encounterSchema = new Schema({
    person:     {type: mongoose.ObjectId},
    position:   {type: mongoose.ObjectId},
    when:       {type: Date},
    type:       {
                    type: String,
                    enum: ['email', 'phone', 'linkedIn']
                },
    details:    {type: String},
    email:      {type: mongoose.ObjectId},
    hide:       {type: Boolean, default: false}
}, {
    timestamps: true
})

const Encounter = mongoose.model('Encounter', encounterSchema)

module.exports =  Encounter 
