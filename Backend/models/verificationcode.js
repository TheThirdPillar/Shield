var mongoose = require('mongoose')
var Schema = mongoose.Schema

var VerificationCodeSchema = new Schema({
    code: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})

VerificationCodeSchema.statics.findCodeByValue = function findCodeByValue(value, callback) {
    return this.findOne({ code: value }, callback)
}

module.exports = mongoose.model('VerificationCode', VerificationCodeSchema)