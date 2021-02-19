/**
 * An Contact records an email (received or sent) or a phone conversation with a Person about a Position.
 * For an email contact, the email ObjectId value is set. Otherwise the details value describes the conversation
 */
const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const contactSchema = new Schema({
    person:     {type: mongoose.ObjectId},
    position:   {type: mongoose.ObjectId},
    when:       {type: Date},
    type:       {
                    type: String,
                    enum: ['email', 'phone'],
                    lowercase: true
                },
    details:    {type: String},
    email:      {type: mongoose.ObjectId}
}, {
    timestamps: true
})

const Contact = mongoose.model('Contact', contactSchema)

module.exports =  Contact 
// module.exports = {Contact}