var mongoose = require('mongoose')
var Schema = mongoose.Schema

var IdentitySchema = new Schema({
    shieldUser: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    username: { type: String },
    profile: { type: Object, },
    identityDocuments: [{type: Schema.Types.ObjectId, ref: 'Document'}],
    educationRecords: [{ type: Schema.Types.ObjectId, ref: 'Record'}],
    professionalRecords: [{type: Schema.Types.ObjectId, ref: 'Record'}],
    skillRecords: [{type: Schema.Types.ObjectId, ref: 'UserSkillData'}],
    // wellBeingScore: {type: Number, default: 0, max: 100, min: 0},
    wellBeingStacks: [{type: Schema.Types.ObjectId, ref: 'WellBeingStack'}],
    wellBeingValidation: {type: Schema.Types.ObjectId, ref: 'WellBeingValidation'},
    virtues: [{type: String}],
    softskills: [{type: String}],
    communities: [{type: Schema.Types.ObjectId, ref: 'UserCommunity'}],
    balance: {type: Number, minimum: [0, 'Balance cannot be negative.'], default: 0},
    admin: {type: Schema.Types.ObjectId, ref: 'Community'}
})

IdentitySchema.statics.findByUsername = function findByUsername (username, callback) {
    return this.findOne({username, username}, callback)
}

IdentitySchema.statics.findByShieldUser = function findByShieldUser (user, callback) {
    return this.findOne({shieldUser: user._id}, callback)
}

// TODO: Search by PublicKey method which should 
// return an identity after searching throudh 
// shieldUser field, without hopefully populating.

module.exports = mongoose.model('Identity', IdentitySchema)