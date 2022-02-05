/**
 * A position 
 */
const mongoose = require('mongoose')


const positionSchema = new mongoose.Schema({
    title:      {type: String},
    url:        {type: String, default: ''},
    reference:  {type: String, default: ''},      // TODO: What is this?
    company:    {type: mongoose.ObjectId},
    person:     {type: mongoose.ObjectId},
    postedDate: {type: Date},
    appliedDate:{type: Date},
    hide:       {type: Boolean, default: false}
}, {
    timestamps: true
})

const Position = mongoose.model('Position', positionSchema)

module.exports = Position