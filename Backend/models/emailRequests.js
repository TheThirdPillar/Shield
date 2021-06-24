var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EmailRequestSchema = new Schema({
    requestedByEmail: { type: String, required: true },
    requestedBySocialProfileURL: { type: String, required: true },
    identityProfileRequested: { type: Schema.Types.ObjectId, ref: 'Identity', required: true},
    requestedOn: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('EmailRequest', EmailRequestSchema)