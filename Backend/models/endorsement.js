var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EndorsementSchema = new Schema({
    endorsementXP: {type: Number, default: 5},
    endorsedBy: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    endorsedOn: {type: Date, default: Date.now()},
    gigId: {type: String, required: true}, // TODO: Update to schema
    endorsedVirtues: [{type: String}]
})

module.exports = mongoose.model('Endorsement', EndorsementSchema)