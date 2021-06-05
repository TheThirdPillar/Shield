var mongoose = require('mongoose')
var Schema = mongoose.Schema

// TODO: Only one verification requests per document.

var DocumentSchema = new Schema({
    encryptedFile: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Identity', required: true },
    record: { type: Schema.Types.ObjectId, ref: 'Record', required: true },
    signed: { type: Schema.Types.ObjectId, ref: 'Request' },
    encryptedKey: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now() },
    dateSigned: { type: Date },
    signedBy: { type: Schema.Types.ObjectId, ref: 'Identity'},
    signedHash: { type: String },
    signature: { type: String }
})

module.exports = mongoose.model('Document', DocumentSchema)