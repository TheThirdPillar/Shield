var mongoose = require('mongoose')
var Schema = mongoose.Schema

var GigSchema = new Schema({
    gigTitle: {type: String, required: true},
    gigDescription: {type: String, required: true},
    submissionCount: {type: Number, required: true}, // TODO: Update to a schema
    gigStartDate: {type: Date, required: true},
    gigEndDate: {type: Date, required: true},
    gigCommunity: {type: Schema.Types.ObjectId, ref: 'Community', required: true},
    gigSkills: [{type: String, required: true}], // TODO: Update to a schema
    postedBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    postedOn: {type: Date, default: Date.now() },
    gigType: {type: Number, required: true, }, // TODO: For now, 0 and 1 -> 0 is endorsement and 1 is paid work and endorsement
    submissions: [{type: Schema.Types.ObjectId, ref: 'Submission'}],
    reward: {type: Number, min: [0, 'Reward cannot be less than 0.'], required: true},
    encryptedFile: {type: String, required: true},
    encryptedKey: {type: String, required: true}  
})

module.exports = mongoose.model('Gig', GigSchema)