var mongoose = require('mongoose')
var Schema = mongoose.Schema

//TODO: Store each application data here, 
// as defined by the scope when the said
// applications are registered.
var UserApplicationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    application: { type: Schema.Types.ObjectId, ref: 'Application' },
    sessionToken: { type: String },
    applicationData: { type: Object, default: {} }
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

module.exports = mongoose.model('UserApplication', UserApplicationSchema)