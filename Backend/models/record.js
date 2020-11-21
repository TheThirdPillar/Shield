var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RecordSchema  = new Schema({
    type: { type: String, required: true },
    recordData: { type: Object, required: true },
    documents: [ { type: Schema.Types.ObjectId, ref: 'Document'}],
    verificationStatue: { type: Boolean, default: false, required: true }
})

module.exports = mongoose.model('Record', RecordSchema)