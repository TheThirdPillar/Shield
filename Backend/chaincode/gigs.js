var Community = require('../models/community')
var Gig = require('../models/gig')

module.exports = (() => {
    return {
        addGig: (formData, user, callback) => {
            Community.findById(formData.community, (error, community) => {
                if (error) {
                    let response = {
                        status: 'FAILED',
                        errors: error
                    }
                    return callback(response)
                } else {
                    let gig = new Gig({
                        gigTitle: formData.title,
                        gigDescription: formData.description,
                        gigCategory: formData.category,
                        gigStartDate: new Date(formData.gigStartDate),
                        gigEndDate: new Date(formData.gigEndDate),
                        gigCommunity: community._id,
                        gigSkills: formData.skillDetails,
                        postedBy: user._id,
                        gigType: formData.type,
                        reward: formData.reward
                    })
                    gig.save((error, gig) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let response = {
                                status: "SUCCESS",
                                gig: gig._id
                            }
                            return callback(response)
                        }
                    })
                }
            })
        },
        getAdminData: (user, callback) => {
            // Find all the communities and all the
            // gigs posted by the admin
            Community.find({admin: user._id}, (error, communities) => {
                if (error) return callback({status: 'FAILED', errors: error})
                if (communities.length == 0) return callback({status: 'FAILED', error: 'User is not admin for any community.'})
                Gig.find({postedBy: user._id})
                .populate({path: 'gigCommunity'})
                .populate({path: 'postedBy'})
                .exec((error, gigs) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        let response = {
                            status: 'SUCCESS',
                            gigs: gigs,
                            communities: communities
                        }
                        return callback(response)
                    }
                })
            })
        } 
    }
})()