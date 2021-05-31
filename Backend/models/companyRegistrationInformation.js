var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CompanyRegistrationSchema = new Schema({
    companyIncorporationCertificate: {type: String, required: true},
    companyIdentificationNumber: {type: String, required: true},
    companyGSTNumber: {type: String, required: true},
    companyTANNumber: {type: String, required: true},
    companyDirectors: [{type: Schema.Types.ObjectId, ref: 'CompanyDirector'}]
})

module.exports = mongoose.model('CompanyRegistration', CompanyRegistrationSchema)