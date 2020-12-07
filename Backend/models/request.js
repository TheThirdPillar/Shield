var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RequestSchema = new Schema({
    type: {type: String, required: true}, // TODO: define possible types and add restrictions.
    document: {type: Schema.Types.ObjectId, ref: 'Document', required: true},
    requestedBy: {type: Schema.Types.ObjectId, ref: 'Identity',  required: true},
    requestedTo: {type: Schema.Types.ObjectId, ref: 'Identity', required: true},
    sharedKey: {type: String},
    status: {type: String, default: 'pending'}, // TODO: define possible types and restrictions
    requestedOn: {type: Date, default: Date.now() },
    dateOfAction: {type: Date}
})

module.exports = mongoose.model('Request', RequestSchema)