var Community = require('../models/community')

module.exports = (() => {
    return {
        addGig: (formData, user, callback) => {
            console.log(formData)
            console.log(user)    
            let response = {
                status: "SUCCESS"
            }
            return callback(response)
        },
        getCommunitiesByAdmin: (user, callback) => {
            Community.find({admin: user._id}, (error, communities) => {
                if (error) {
                    let response = {
                        status: 'FAILED',
                        errors: error
                    }
                    return callback(response)
                } else {
                    let response = {
                        status: 'SUCCESS',
                        communities: communities
                    }
                    return callback(response)
                }
            })
        } 
    }
})()