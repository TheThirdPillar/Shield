var Community = require('../models/community')
var Gig = require('../models/gig')
var UserGigModel = require('../models/usergigmodel')
var Submission = require('../models/submission')
var Endorsement = require('../models/endorsement')
var UserSkillData = require('../models/userskilldata')

// TODO: Some actions need to verify the 'USER' in model
// is the one making the request.

// TODO: Try and catch error handling.

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
                        submissionCount: Number(formData.submissionCount),
                        gigStartDate: new Date(formData.gigStartDate),
                        gigEndDate: new Date(formData.gigEndDate),
                        gigCommunity: community._id,
                        gigSkills: formData.skillDetails,
                        postedBy: user._id,
                        gigType: formData.type,
                        reward: formData.reward,
                        encryptedFile: formData.encryptedFile,
                        encryptedKey: formData.encryptedKey
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
            // TODO: Gigs is added multiple times in 'gigs' and 'applications' - Fix this.
            Community.find({admin: user._id}, (error, communities) => {
                if (error) return callback({status: 'FAILED', errors: error})
                if (communities.length == 0) return callback({status: 'FAILED', error: 'User is not admin for any community.'})
                Gig.find({postedBy: user._id})
                .populate({path: 'gigCommunity'})
                .populate({path: 'postedBy'})
                .populate({path: 'submissions', ref: 'Submissions', populate: {path: 'submittedBy', ref: 'User'}})
                .exec((error, gigs) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        UserGigModel.find({$and: [
                            {gig: {$in: gigs}},
                            {'status': 1}
                        ]})                        
                        .populate({path: 'user'})
                        .populate({path: 'gig'})
                        .exec((error, applications) => {
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
                                    communities: communities,
                                    applications: applications
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            })
        },
        getGigsData: (user, callback) => {
            // Currently we are returning all gigs and
            // all user-gigs associations.
            // TODO: All gigs pagination
            Gig.find({postedBy: {$ne: user}})
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
                    UserGigModel.find({user: user})
                    .populate({path: 'submission'})
                    .exec((error, usergigmodel) => {
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
        removeBookmark: (gigId, user, callback) => {
            UserGigModel.findOne({gig: gigId, user: user}, (error, usergigmodel) => {
                if (error) {
                    let response = {
                        status: 'FAILED',
                        errors: error
                    }
                    return callback(response)
                } else {
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
        },
        gigApplication: (formData, user, callback) => {
            UserGigModel.findOne({gig: formData.gigId, user: user}, (error, usergigmodel) => {
                if (error) {
                    let response = {
                        status: 'FAILED',
                        errors: error
                    }
                    return callback(response)
                } 
                if (usergigmodel) {
                    if (usergigmodel.status > 0) return callback({status: 'FAILED', errors: 'User has already applied to the gig.'})
                    usergigmodel.status = 1
                    usergigmodel.save((error, updated) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let response = {
                                status: "SUCCESS",
                                applied: updated,
                                message: 'Successfully applied to the gig.'
                            }
                            return callback(response)
                        }
                    })
                } else {
                    Gig.findById(formData.gigId, (error, gig) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let usergigmodel = new UserGigModel({
                                user: user._id,
                                gig:  gig._id,
                                status: 1
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
                                        applied: saved,
                                        message: 'Successfully applied to the gig.'
                                    }
                                    return callback(response)
                                }
                            })
                        }
                    })
                }
            })
        },
        handleApplication: (formData, callback) => {
            UserGigModel.findById(formData.application, (error, usergigmodel) => {
                if (error) {
                    let response = {
                        status: 'FAILED',
                        errors: error
                    }
                    return callback(response)
                } else {
                    usergigmodel.status = formData.status
                    if (formData.sharedKey) {
                        usergigmodel.sharedKeyGigDocument = formData.sharedKey
                    }
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
                                message: 'Successfully updated the gig application,',
                                application: saved._id
                            }
                            return callback(response)
                        }
                    })
                }
            })
        },
        gigSubmission: (formData, user, callback) => {
            // TODO: This function seems mighty fucked up. Fix please.
            // TODO: Check for date range, duplicate submissions etc.
            Gig.findById(formData.gigId, (error, gig) => {
                if (error) {
                    let response = {
                        status: 'FAILED',
                        errors: error
                    }
                    return callback(response)
                } else {
                    let submission = new Submission({
                        submissionFile: formData.encryptedSolution,
                        submissionKeyUser: formData.encryptedSolutionKeyUser,
                        submissionKeyAdmin: formData.encryptedSolutionKeyAdmin,
                        skillToEndorse: formData.userskilldata,
                        gig: formData.gigId,
                        submittedBy: user._id
                    })
                    submission.save((error, submission) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            UserGigModel.findOne({user: user._id, gig: gig._id}, (error, usergigobject) => {
                                if (error) {
                                    let response = {
                                        status: 'FAILED',
                                        errors: error
                                    } 
                                    return callback(response)
                                } else {
                                    usergigobject.submission = submission._id
                                    usergigobject.status = 4
                                    usergigobject.save((error, updateddocument) => {
                                        if (error) {
                                            let response = {
                                                status: 'FAILED',
                                                errors: error
                                            }
                                            return callback(response)
                                        } else {
                                            gig.submissions.push(updateddocument.submission)
                                            gig.save((error, saved) => {
                                                if (error) {
                                                    let response = {
                                                        status: 'FAILED',
                                                        errors: error
                                                    }
                                                    return callback(response)
                                                } else {
                                                    let response = {
                                                        status: 'SUCCESS',
                                                        gig: saved._id, 
                                                        submission: submission._id
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
                }
            })
        },
        handleSubmission: (formData, user, callback) => {
            // TODO: Boundary condtions, user, gig, submission validation etc.
            Submission.findById(formData.submissionId, (error, submission) => {
                if (error) {
                    let response = {
                        status: "FAILED",
                        errors: error
                    }
                    return callback(response)
                } else {
                    submission.status = (formData.status === "0") ? "2" : "1"
                    submission.dateAction = Date.now()
                    submission.save((error, submission) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            // Submission is saved, if accepted create endorsement, else 
                            // do nothing.
                            if (submission.status === "1") {
                                // create endorsement
                                let endorsement = new Endorsement({
                                    endorsedBy: user._id,
                                    gigId: submission.gig
                                })
                                endorsement.save((error, endorsement) => {
                                    if (error) {
                                        let response = {
                                            status: "FAILED",
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        UserSkillData.findById(submission.skillToEndorse, (error, userskilldata) => {
                                            if (error) {
                                                let response = {
                                                    status: 'FAILED',
                                                    errors: error
                                                }
                                                return callback(response)
                                            } else {
                                                // TODO: Only second update is needed.
                                                userskilldata.data.endorsements.push(endorsement)
                                                userskilldata.endorsements.push(endorsement)
                                                userskilldata.save((error, saved) => {
                                                    if (error) {
                                                        let response = {
                                                            status: 'FAILED',
                                                            errors: error
                                                        }
                                                        return callback(response)
                                                    } else {
                                                        let response = {
                                                            status: "SUCCESS",
                                                            message: "Submission accepted and user skill endorsed.",
                                                            userskill: saved
                                                        }
                                                        return callback(response)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                let response = {
                                    status: "SUCCESS",
                                    message: "Submission rejected successfully."
                                }
                                return callback(response)
                            }
                        }
                    })
                }
            })
        } 
    }
})()