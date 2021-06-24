var mongoose = require('mongoose')
var Schema = mongoose.Schema

var wellBeingValidationSchema = new Schema({
    wellBeingStackHash: {type: String, required: true},
    requestedDate: {type: Date, default: Date.now()},
    wellBeingValidator: {type: Schema.Types.ObjectId, required: true, ref: 'Identity'},
    wellBeingValidatorCommunity: {type: Schema.Types.ObjectId, required: true, ref: 'Community'},
    validatorSignature: {type: String},
    validationDate: {type: Date},
    validationStatus: {type: String, default: 'PENDING', enum: ['PENDING', 'ACCEPTED', 'REJECTED']}
})

module.exports = mongoose.model('WellBeingValidation', wellBeingValidationSchema)