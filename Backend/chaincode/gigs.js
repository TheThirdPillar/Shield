var Community = require('../models/community')
var Gig = require('../models/gig')
var UserGigModel = require('../models/usergigmodel')

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
        },
        getGigsData: (user, callback) => {
            // Currently we are returning all gigs and
            // all user-gigs associations.
            // TODO: All gigs pagination
            Gig.find({})
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
                    UserGigModel.find({user: user}, (error, usergigmodel) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let response = {
                                status: 'SUCCESS',
                                allGigs: gigs,
                                usergigmodels: usergigmodel
                            }
                            return callback(response)
                        }
                    })
                }
            })
        },
        bookmarkGig: (formData, user, callback) => {
            // TODO:  Search if a bookmark object already exists.
            Gig.findById(formData.gig, (error, gig) => {
                if (error) {
                    let response = {
                        status: 'FAILED',
                        errors: error
                    }
                    return callback(response)
                } else {
                    let usergigmodel = new UserGigModel({
                        user: user._id,
                        gig:  gig._id
                    })
                    usergigmodel.save((error, saved) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let response = {
                                status: 'SUCCESS',
                                bookmark: saved._id
                            }
                            return callback(response)
                        }
                    })
                }
            })
        },
        removeBookmark: (bookmarkId, user, callback) => {
            UserGigModel.findById(bookmarkId, (error, usergigmodel) => {
                if (error) {
                    let response = {
                        status: 'FAILED',
                        errors: error
                    }
                    return callback(response)
                } else {
                    // TODO: Check if request is coming from same user
                    console.log(user)
                    UserGigModel.deleteOne({_id: usergigmodel._id}, (error) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let response = {
                                status: 'SUCCESS',
                                message: 'Successfully removed the bookmark'
                            }
                            return callback(response)
                        }
                    })
                }
            })
        } 
    }
})()