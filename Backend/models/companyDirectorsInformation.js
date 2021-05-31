var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CompanyDirectorSchema = new Schema({
    companyDirectorName: {type: String, required: true},
    companyDirectorIdentificationNumber: {type: String, required: true},
    companyDirectorIdentityProfile: {type: Schema.Types.ObjectId, required: true, ref: 'Identity'}
})

module.exports = mongoose.model('CompanyDirector', CompanyDirectorSchema)