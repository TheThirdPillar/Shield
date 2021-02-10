var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SubmissionSchema = new Schema({
    status: {type: String, default: 0}, // 0 is pending, 1 is accepted, 2 is rejected
    submissionFile: {type: String},
    submissionKeyUser: {type: String},
    submissionKeyAdmin: {type: String},
    skillToEndorse: {type: String, required: true}, // TODO: Update to UserSkillData object
    gig: {type: String, required: true}, // TODO: We can update this to Gig Schema, but since sumbissions are already part of gigs, this field seems redundant anyway.
    dateSubmission: {type: Date, default: Date.now()},
    dateAction: {type: Date},
    submittedBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    externalURLs: [{type: String}]    
})

module.exports = mongoose.model('Submission', SubmissionSchema)