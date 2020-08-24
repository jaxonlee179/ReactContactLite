/**
 * An Company is typed as either a recruiter or an "enterprise" (public or private)
 */
const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const schema = new Schema({
    name:       {type: String, required: true},
    url:        {type: String, default: ''},
    address:    {type: String, default: ''},
    city:       {type: String, default: ''},
    phone:      {type: String, default: ''}
    /*,
    login:      {type: String, default: ''},
    password:   {type: String, default: ''}
    */
}, {
    timestamps: true
})

const Company = mongoose.model('Company', schema)

module.exports = Company