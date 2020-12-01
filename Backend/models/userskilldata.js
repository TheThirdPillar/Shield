var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSkillData = new Schema({
    data: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('UserSkillData', UserSkillData)