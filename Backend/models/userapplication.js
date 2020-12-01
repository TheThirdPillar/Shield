var mongoose = require('mongoose')
var Schema = mongoose.Schema

//TODO: Store each application data here, 
// as defined by the scope when the said
// applications are registered.
var UserApplicationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    application: { type: Schema.Types.ObjectId, ref: 'Application' },
    sessionToken: { type: String },
    applicationData: { type: Object, default: {} },
    educationRecord: [{ type: Schema.Types.ObjectId, ref: 'Record'}],
    professionalRecord: [{ type: Schema.Types.ObjectId, ref: 'Record'}],
    skillRecord: [{ type: Schema.Types.ObjectId, ref: 'UserSkillData'}]
}, {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
})

UserApplicationSchema.statics.findAllUserByApplication = function findAllUserByApplication(application, callback) {
    return this.find({ application: application}, callback)
}

UserApplicationSchema.statics.findApplicationDataBySession = function findApplicationDataBySession(token, callback) {
    return this.findOne({ sessionToken: token}, callback)
}

UserApplicationSchema.statics.findUsersByShieldProfiles = function findUsersByShieldProfiles(profiles, callback) {
  return this.find({ user: { $in: profiles}}, callback)
}

module.exports = mongoose.model('UserApplication', UserApplicationSchema)