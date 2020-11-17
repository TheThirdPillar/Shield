/* Data models */
const { application } = require('express')
const Application = require('../models/application')
const UserApplication = require('../models/userapplication')

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
                                let user = allDataUserApplication.filter(userApplication => (userApplication && userApplication.applicationData && userApplication.applicationData.username === searchedUsername))
                                
                                console.log(user)
        
                                let response = {
                                    status: "SUCCESS",
                                    user: user
                                }
                                console.log(response)
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
        registerUser: (userData, applicationId, callback) => {
            try {
                let response = {
                    status: "Succcess"
                }
                callback(response)
            } catch (error) {
                let response = {

                    status: "FAILED",
                    error: error
                }
                callback(response)
            }
        }
    }
})() 