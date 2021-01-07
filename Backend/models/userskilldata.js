var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSkillData = new Schema({
    data: {
        type: Object,
        required: true
    },
    endorsements: [{type: Schema.Types.ObjectId, ref: 'Endorsement'}]
})

module.exports = mongoose.model('UserSkillData', UserSkillData)