var mongoose = require('mongoose')
var Schema = mongoose.Schema

// TODO: Community and their signatures and approvals
// TODO: Scope also has be defined here
var ApplicationSchema = new Schema({
    appName: { type: String, required: true, unique: true },
    appId: { type: String, required: true, unique: true },
    sponsor: { type: Schema.Types.ObjectId, ref: 'Community'},
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

ApplicationSchema.statics.findApplicationById = function findApplicationById(appId, callback) {
    return this.findOne({ appId: appId }, callback)
}

module.exports = mongoose.model('Application', ApplicationSchema)