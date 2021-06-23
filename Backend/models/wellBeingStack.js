var mongoose = require('mongoose')
var Schema = mongoose.Schema

var WellBeingStackSchema = new Schema({
    stackName: {type: String, required: true, enum: ['physiology', 'energy', 'feeling', 'thinking', 'behavior', 'result']},
    // TODO: This should be MAP and not object.
    stackRatings: {type: Object, required: true},
    lastUpdated: {type: Date},
    validatorSignature: {type: String},
    signatureDate: {type: Date}
    // TODO: Implement a stackScore - should calculate from
    // TODO: array of stackRatings
    // stackScore: {type: Number, default: 0}
})

module.exports = mongoose.model('WellBeingStack', WellBeingStackSchema)