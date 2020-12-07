var mongoose = require('mongoose')
const { modelName } = require('./application')
var Schema = mongoose.Schema

var DocumentSchema = new Schema({
    encryptedFile: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Identity', required: true },
    record: { type: Schema.Types.ObjectId, ref: 'Record', required: true },
    signed: { type: Schema.Types.ObjectId, ref: 'Request' },
    encryptedKey: { type: String, required: true },
    dateCreated: { type: Date, required: true },
    dateSigned: { type: Date },
    signedBy: { type: Schema.Types.ObjectId, ref: 'User'},
    signature: { type: String }
})

module.exports = mongoose.model('Document', DocumentSchema)