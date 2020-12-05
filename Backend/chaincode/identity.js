/* Data models */
const Application = require('../models/application')
const userapplication = require('../models/userapplication')
const UserApplication = require('../models/userapplication')
const Record = require('../models/record')
const UserSkillData = require('../models/userskilldata')
const Document = require('../models/document')
const Request = require('../models/request')
const User = require('../models/user')
const Identity = require('../models/identity')
const request = require('../models/request')
const identity = require('../models/identity')

// TODO: Application Search will be repeated here,
// must be updated once route validators are improved.

module.exports = (() => {
    return {
        searchApplicationUserByUsername: (searchedUsername, callback) => {
            try {
                Identity.findByUsername(searchedUsername, (error, user) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        let response = {
                            status: 'SUCCESS',
                            user: user
                        }
                        return callback(response)
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
        registerUser: (formData, user, callback) => {
            try {
                Identity.findByShieldUser(user, (error, user) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        let {username, ...profile} = formData
                        user.username = username
                        user.profile = profile
                        user.save((error, user) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: 'SUCCESS',
                                    user: user
                                }
                                return callback(response)
                            }
                        })
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
        addEducationRecord: (formData, user, callback) => {
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
                        Identity.findByShieldUser(user, (error, user) => {
                            if (error) {
                                let response = {
                                    status: 'SUCCSESS',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                user.educationRecords.push(savedRecord)
                                user.save((error, user) => {
                                    if (error) {
                                        let response = {
                                            status: 'FAILED',
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        let response = {
                                            status: 'SUCCESS',
                                            user: user,
                                            message: 'Successfully added the educational record.'
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
                    error : error
                }
                return callback(response)
            }
        },
        addProfessionalRecord: (formData, user, callback) => {
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
                        Identity.findByShieldUser(user, (error, user) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                user.professionalRecords.push(savedRecord)
                                user.save((error, user) => {
                                    if (error) {
                                        let response = {
                                            status: 'FAILED',
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        let response = {
                                            status: 'SUCCESS',
                                            user: user,
                                            message: 'Successfully added the professional record.'
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
                    error : error
                }
                return callback(response)
            }
        },
        addSkillRecord: (formData, user, callback) => {
            try {
                let userskilldata = new UserSkillData({
                    data: formData
                })
                userskilldata.save((error, skilldata) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            message: 'Unable to execute transaction'
                        }
                        return callback(response)
                    } else {
                        Identity.findByShieldUser(user, (error, user) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                user.skillRecords.push(skilldata)
                                user.save((error, user) => {
                                    if (error) {
                                        let response = {
                                            status: 'FAILED',
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        let response = {
                                            status: 'SUCCESS',
                                            user: user,
                                            message: 'Successfully added the skill record.'
                                        }
                                        return callback(response)
                                    }
                                })
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
        getUserData: (user, callback) => {
            try {
                Identity.findOne({shieldUser: user._id})
                .populate({path: 'educationRecords', populate: {path: 'documents', populate: {path: 'signed'}}})
                .populate({path: 'professionalRecords', populate: {path: 'documents', populate: {path: 'signed'}}})
                .populate({path: 'skillRecords'})
                .exec((error, identityData) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            message: 'Unable to fetch userdata'
                        }
                        return callback(response)
                    } else {
                        if (!identityData) {
                            let newIdentityUser = new Identity({
                                shieldUser: user._id
                            })
                            newIdentityUser.save((error, savedDocument) => {
                                if (error) {
                                    let response = {
                                        status: 'FAILED',
                                        errors: error
                                    }
                                    return callback(response)
                                } else {
                                    let response = {
                                        status: 'SUCCESS',
                                        user: savedDocument
                                    }
                                    return callback(response)
                                }
                            })
                        } else {
                            let response = {
                                status: 'SUCCESS',
                                user: identityData
                            }
                            return callback(response)
                        }
                    }
                })
            } catch (error) {
                console.error(error)
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