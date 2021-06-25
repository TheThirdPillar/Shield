var mongoose = require('mongoose')
var Schema = mongoose.Schema

var wellBeingValidationSchema = new Schema({
    wellBeingStack: [{type: Object, required: true}],
    requestedBy: {type: Schema.Types.ObjectId, ref: 'Identity', required: true},
    requestedDate: {type: Date, default: Date.now()},
    wellBeingValidator: {type: Schema.Types.ObjectId, required: true, ref: 'Identity'},
    wellBeingValidatorCommunity: {type: Schema.Types.ObjectId, required: true, ref: 'Community'},
    validatorSignature: {type: String},
    validationDate: {type: Date},
    validationStatus: {type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected']}
})

module.exports = mongoose.model('WellBeingValidation', wellBeingValidationSchema)