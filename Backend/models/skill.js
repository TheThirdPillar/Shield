var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SkillSchema = new Schema({
    name: { type: String, required: true, unique: true },
    relatedSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }]
})

module.exports = mongoose.model('Skill', SkillSchema)