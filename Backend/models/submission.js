var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SubmissionSchema = new Schema({
    gig: {type: Schema.Types.ObjectId, ref: 'Gig'}
})

module.exports = mongoose.model('Submission', SubmissionSchema)