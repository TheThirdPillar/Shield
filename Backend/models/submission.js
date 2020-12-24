var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SubmissionSchema = new Schema({
    status: {type: String, default: 0}, // 0 is pending, 1 is accepted, 2 is rejected
    submissionFile: {type: String, required: true},
    submissionKey: {type: String, required: true},
    sharedKeySolutionDocument: {type: String, required: true}
})

module.exports = mongoose.model('Submission', SubmissionSchema)