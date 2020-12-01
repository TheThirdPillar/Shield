var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RequestSchema = new Schema({
    type: {type: String, required: true},
    document: {type: Schema.Types.ObjectId, ref: 'Document', required: true},
    requestedBy: {type: Schema.Types.ObjectId, ref: 'User',  required: true},
    requestedTo: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    sharedKey: {type: String, required: true},
    status: {type: String, default: 'pending'},
    requestedOn: {type: Date, default: Date.now() },
    dateOfAction: {type: Date}
})

module.exports = mongoose.model('Request', RequestSchema)