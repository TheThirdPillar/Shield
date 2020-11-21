/* Data models */
const Application = require('../models/application')
const userapplication = require('../models/userapplication')
const UserApplication = require('../models/userapplication')
const Record = require('../models/record')

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
                        if (userapplication.applicationData && !userapplication.applicationData.educationRecord) {
                            Object.assign(userapplication.applicationData, {'educationRecord': []})  
                        } 
                        userapplication.applicationData.educationRecord.push(savedRecord)
                        userapplication.markModified('applicationData')
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
                        if (userapplication.applicationData && !userapplication.applicationData.professionalRecord) {
                            Object.assign(userapplication.applicationData, {'professionalRecord': []})  
                        } 
                        userapplication.applicationData.professionalRecord.push(savedRecord)
                        userapplication.markModified('applicationData')
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
        }
    }
})() 