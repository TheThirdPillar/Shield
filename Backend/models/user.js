var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    publicKey: { 
        type: String, 
        required: true, 
        unique: true,
        index: {
            unique: true,
            partialFilterExpression: { publicKey: { $type: 'string' } }
        }
    },
    active: { type: Boolean, default: false }
})

UserSchema.statics.findUserByEmail = function findUserByEmail(email, callback) {
    return this.findOne({ email: email }, callback)
}

UserSchema.statics.findUserByPublicKey = function findUserByPublicKey(publicKey, callback) {
    return this.findOne({publicKey: publicKey}, callback)
}

module.exports = mongoose.model('User', UserSchema)