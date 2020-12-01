/* Data models */
const Application = require('../models/application')
const userapplication = require('../models/userapplication')
const UserApplication = require('../models/userapplication')
const Record = require('../models/record')
const UserSkillData = require('../models/userskilldata')
const Document = require('../models/document')
const Request = require('../models/request')
const User = require('../models/user')
const request = require('../models/request')

// TODO: Application Search will be repeated here,
// must be updated once route validators are improved.

module.exports = (() => {
    return {
        searchApplicationUserByUsername: (searchedUsername, applicationId, callback) => {
            try {
                Application.findApplicationById(applicationId, (error, application) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            error: error
                        }
                        return callback(response)
                    } else {
                        UserApplication.findAllUserByApplication(application._id, (error, allDataUserApplication) => {
                            if (error) {
                                let response = {
                                    status: "FAILED",
                                    error: error
                                }
                                return callback(response)
                            } else {
                                let user = allDataUserApplication.filter(userApplication => (userApplication && userApplication.applicationData && userApplication.applicationData.profile && userApplication.applicationData.profile.username === searchedUsername))
        
                                let response = {
                                    status: "SUCCESS",
                                    user: user
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: "FAILED",
                    error: error
                }
                console.log(error)
                callback(response)
            }
        },
        registerUser: (formData, userapplication, callback) => {
            try {

                if (userapplication.applicationData && userapplication.applicationData.profile && userapplication.applicationData.profile.username) {
                    let response = {
                        status: 'FAILED',
                        error: {
                            msg: 'Username once registered cannot be changed.'
                        }
                    }
                    return callback(response)
                }

                Object.assign(userapplication.applicationData, {'profile': formData})
                userapplication.markModified('applicationData')
                userapplication.save((error, saved) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            error: error
                        }
                        return callback(response)
                    } else {
                        let response = {
                            status: "SUCCESS",
                            message: "Successfully updated the user data",
                            userData: saved
                        }
                        return callback(response)
                    }
                })
            } catch (error) {
                console.log(error)
                let response = {

                    status: "FAILED",
                    error: error
                }
                callback(response)
            }
        },
        addEducationRecord: (formData, userapplication, callback) => {
            try {

                let record = new Record({
                    type: 'education',
                    recordData: formData
                })

                record.save((error, savedRecord) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            error: error
                        }
                        return callback(response)
                    } else {
                        userapplication.educationRecord.push(savedRecord)
                        userapplication.markModified('educationRecord')
                        userapplication.save((error, saved) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    error: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: 'SUCCESS',
                                    message: 'Record successfully added to the user data.'
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    error : error
                }
                return callback(response)
            }
        },
        addProfessionalRecord: (formData, userapplication, callback) => {
            try {

                let record = new Record({
                    type: 'professional',
                    recordData: formData
                })

                record.save((error, savedRecord) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            error: error
                        }
                        return callback(response)
                    } else {
                        userapplication.professionalRecord.push(savedRecord)
                        userapplication.markModified('professionalRecord')
                        userapplication.save((error, saved) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    error: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: 'SUCCESS',
                                    message: 'Record successfully added to the user data.'
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    error : error
                }
                return callback(response)
            }
        },
        addSkillRecord: (formData, userapplication, callback) => {
            try {
                let userskilldata = new UserSkillData({
                    data: formData
                })
                userskilldata.save((error, document) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            message: 'Unable to execute transaction'
                        }
                        return callback(response)
                    } else {
                        userapplication.skillRecord.push(document)
                        userapplication.markModified('skillRecord')
                        userapplication.save((error, saved) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: 'SUCCESS',
                                    message: 'Skill record successfully saved to user data.'
                                }
                                return callback(response)
                            }
                        })
                    }
                })
                 // TODO: Add skills mentioned by user to the skillDB
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        getUserData: (userapplication, callback) => {
            try {
                UserApplication.findById(userapplication._id)
                .populate({path: 'educationRecord', populate: {path: 'documents', populate: {path: 'signed'}}})
                .populate({path: 'professionalRecord', populate: {path: 'documents', populate: {path: 'signed'}}})
                .populate({path: 'skillRecord'})
                .exec((error, userData) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            message: 'Unable to fetch userdata'
                        }
                        return callback(response)
                    } else {
                        let response = {
                            status: 'SUCCESS',
                            userData: userData
                        }
                        return callback(response)
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        updateUser: (formData, userapplication, callback) => {

            try {
                Object.assign(userapplication.applicationData, {'profile': formData})
                userapplication.markModified('applicationData')
                userapplication.save((error, saved) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            error: error
                        }
                        return callback(response)
                    } else {
                        let response = {
                            status: "SUCCESS",
                            message: "Successfully updated the user data",
                            userData: saved
                        }
                        return callback(response)
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        addDocument: (formData, userapplication, callback) => {
            try {
                let recordId = formData.recordId
                Record.findById(recordId, (error, record) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            error: error
                        }
                        return callback(response)
                    } else {
                        // TODO: if record save fails, we should undo document save as well or find ways to retry.
                        let document = new Document({
                            encryptedFile: formData.encryptedFile,
                            owner: userapplication.user,
                            encryptedKey: formData.encryptedKey,
                            dateCreated: new Date(),
                            record: record._id
                        })
                        document.save((error, document) => {
                            if (error) {
                                let response = {
                                    status: "FAILED",
                                    error: error
                                }
                                return callback(response)
                            } else {
                                record.documents.push(document)
                                record.markModified('documents')
                                record.save((error, record) => {
                                    if (error) {
                                        let response = {
                                            status: "FAILED",
                                            error: error
                                        }
                                        return callback(response)
                                    } else {
                                        let response = {
                                            status: "SUCCESS",
                                            message: "Successfully added the document.",
                                            record: record
                                        }
                                        return callback(response)
                                    }
                                })
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        requestVerification: (formData, userapplication, callback) => {
            try {
                Document.findById(formData.document, (error, document) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        User.findUserByPublicKey(formData.receiverPublicKey, (error, receivingUser) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let request = new Request({
                                    type: 'verification',
                                    document: document._id,
                                    requestedBy: userapplication.user,
                                    requestedTo: receivingUser,
                                    sharedKey: formData.sharedKey
                                })
                                request.save((error, request) => {
                                    if (error) {
                                        let response = {
                                            status: 'FAILED',
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        document.signed = request
                                        document.save((error, document) => {
                                            if (error) {
                                                let response = {
                                                    status: 'FAILED',
                                                    errors: error
                                                }
                                                return callback(response)
                                            } else {
                                                let response = {
                                                    status: 'SUCCESS',
                                                    request: request
                                                }
                                                return callback(response)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        getAllRequests: (userapplication, callback) => {
            try {
                let user = userapplication.user
                Request.find({$or: [{requestedBy: user}, {requestedTo: user}]})
                .populate({path: 'document', populate: [{path: 'signed'}, {path: 'record'}]})
                .populate({path: 'requestedBy'})
                .populate({path: 'requestedTo'})
                .exec((error, requests) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        let response = {
                            status: 'SUCCESS',
                            requests: requests,
                            user: user._id
                        }
                        return callback(response)
                    }
                })
            } catch (error) {
                console.log(error)
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        } 
    }
})() 