var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CommunitySchema = new Schema({
    name: { type: String, required: true },
    shortName: { type: String, required: true, unique: true },
    partners: [ { type: Schema.Types.ObjectId, ref: 'User'} ],
    members: [ { type: Schema.Types.ObjectId, ref: 'User'} ],
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    communitySkills: [ {type: Schema.Types.ObjectId, ref: 'Skill' }]
})

CommunitySchema.statics.findCommunityByShortName = function findCommunityByShortName(shortName, callback) {
    return this.findOne({ shortName: shortName}, callback)
}

module.exports = mongoose.model('Community', CommunitySchema)