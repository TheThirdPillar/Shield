var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserGigSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    gig: {type: Schema.Types.ObjectId, required: true, ref: 'Gig'},
    status: {type: Number, default: 0}, // 0 is bookmarked, 1 is applied, 3 is accepted, 4 is rejected, 5 is submitted
    sharedKeyGigDocument: {type: String},
    submission: {type: Schema.Types.ObjectId, ref: 'Submission'}
})

module.exports = mongoose.model('UserGig', UserGigSchema)