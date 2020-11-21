var mongoose = require('mongoose')
const { modelName } = require('./application')
var Schema = mongoose.Schema

var DocumentSchema = new Schema({
    multihash: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    signed: { type: Boolean, default: false },
    signedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    encryptedUserKey: { type: String },
    signeeKey: { type: String },
    dateCreated: { type: Date, required: true },
    dateSigned: { type: Date, required: true }
})

module.exports = mongoose.model('Document', DocumentSchema)