var mongoose = require('mongoose')
var Schema = mongoose.Aggregate.Schema

var UserCommunitySchema = new Schema({
    community: {type: Schema.Types.ObjectId, ref: 'Community', required: true},
    powURL: {type: String, required: true},
    joinDate: {type: Date, required: true},
    leaveDate: {type: Date, default: null}
})

module.exports = mongoose.model('UserCommunity', UserCommunitySchema)