var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RecordSchema  = new Schema({
    type: { type: String, required: true },
    recordData: { type: Object, required: true },
    documents: [ { type: Schema.Types.ObjectId, ref: 'Document'}],
    verificationStatus: { type: Boolean, default: false, required: true },
    dateCreated: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Record', RecordSchema)