var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserCommunitySchema = new Schema({
    community: {type: Schema.Types.ObjectId, ref: 'Community', required: true},
    powURL: {type: String, required: true}
})

module.exports = mongoose.model('UserCommunity', UserCommunitySchema)