const { validationResult } = require('express-validator');
const uuid4 = require('uuid4')
var jwt = require('jsonwebtoken')

/* Custom utilities and others*/
var registrationEmail = require('../utils/emailer/registration')
var tokenSecret = require('../config/jwt')

/* Data models */
const User = require('../models/user')
const VerificationCode = require('../models/verificationcode')
const Application = require('../models/application')
const UserApplication = require('../models/userapplication')
const Identity = require('../models/identity');
const identity = require('../models/identity');

// Function to register user
exports.registerUser = (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'FAILED', errors: errors.array(), message: 'Please try again with a different email address.' })
    }

    try {
        let user = new User({
            email: req.body.email,
            publicKey: req.body.publicKey
        })
        user.save((error, user) => {
            if (error) {
                let response = {
                    status: 'FAILED',
                    errors: error.message,
                    message: 'Unable to add user to the network'
                }
                return res.status(500).json(response)
            }

            // User created, create and send verification code
            let id = uuid4()
            let verificationCode = new VerificationCode({
                code: id,
                user: user
            })
            verificationCode.save((error, code) => {
                if (error) {
                    let response = {
                        status: 'FAILED',
                        errrors: error.message,
                        message: 'Unable to generate verification code. User has been created. Please resend verification code.'
                    }
                    return res.status(500).json(response)
                }
                // Send email
                // TODO: Find a better way to send emails.
                registrationEmail.sendMail(user.email, id)
                let response = {
                    status: 'SUCCESS',
                    errors: null,
                    message: 'User successfully created'
                }
                return res.status(200).json(response)
            })

        })
    } catch (error) {
        let response = {
            status: 'FAILED',
            errors: error,
            message: 'Internal server error'
        }
        return res.status(500).json(response)
    }
}

// Function to verify user
// TODO: Delete the verification code once the user is verified.
// TODO: Set expiry date.
exports.verifyUser = (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'FAILED', errors: errors.array(), message: 'Unable to verify the email' })
    }

    try {
        VerificationCode.findOne({code: req.query.code}, (error, code) => {
            if (error || code == null) {
                let response = {
                    status: 'FAILED',
                    error: 'Unable to find the queried verification code'
                }
                return res.status(400).json(response)
            }
            // If code is found, update USER active status to true
            User.findById(code.user._id, (error, user) => {
                if (error || user == null) {
                    let response = {
                        status: 'FAILED',
                        error: 'Unable to locate user'
                    }
                    return res.status(500).json(response)
                }
                user.active = true
                user.save((error, user) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            error: error.message
                        }
                        return res.status(500).json(response)
                    }
                    let response = {
                        status: 'SUCCESS',
                        message: 'User has been successfully activated.'
                    }
                    return res.status(200).json(response)
                })
            })
        })
    } catch (error) {
        let response = {
            status: 'FAILED',
            message: 'Unkown server error, please try again'
        }
        return res.status(500).json(response)
    }

}

exports.loginUserWithApplication = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ status: 'FAILED', errors: errors.array() })
    }
    try {
        User.findById(req.user._id, (error, user) => {
            if (error || !user) {
                return res.status(500).json({status: 'FAILED', error: error})
            }
            // TODO: Search is repeated here, 
            // we had already checked in route validators
            Application.findApplicationById(req.params['id'], (error, application) => {
                if (error) {
                    return res.status(500).json({stat: 'FAILED', error: error})
                }
                UserApplication.findOne({user: req.user._id, application: application._id}, (error, userapplication) => {
                    if (error) {
                        return res.status(500).json({stat: 'FAILED', error: error})
                    } else {
                        let tokenData = {
                            user: user.publicKey,
                            application: application.appId
                        }
                        let token = jwt.sign(tokenData, tokenSecret.secret, { expiresIn: '1h' })
                        // TODO: Applications may have conditions based on other applications
                        if (!userapplication) {
                            let newUserApplication = new UserApplication({
                                user: req.user._id,
                                application: application._id, 
                                sessionToken: token
                            })
                            newUserApplication.save((error, userApp) => {
                                if (error) {
                                    return res.status(500).json({stat: 'FAILED', error: error})
                                }
                                return res.status(200).json({status: "SUCCESS", token: userApp.sessionToken})
                            })
                        } else {
                            // sign JWT and return data
                            userapplication.sessionToken = token
                            userapplication.save((error, userApp) => {
                                if (error) {
                                    return res.status(500).json({stat: 'FAILED', error: error})
                                }
                                return res.status(200).json({status: "SUCCESS", token: userApp.sessionToken})
                            })
                        }
                    }
                })
            })
        })
    } catch (error) {
        let response = {
            status: 'FAILED',
            message: 'Unkown server error, please try again'
        }
        return res.status(500).json(response)
    }
}

exports.getPublicProfile = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ status: 'FAILED', errors: errors.array() })
    }
    try {
        let username = req.query['username']
        Identity.findByUsername(username)
        .populate({path: 'educationRecords', populate: {path: 'documents', populate: {path: 'signed'}}})
        .populate({path: 'professionalRecords', populate: {path: 'documents', populate: {path: 'signed'}}})
        .populate({path: 'skillRecords'})
        .exec((error, identity) => {
            if (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return res.status(500).json(response)
            } else {
                let response = {
                    status: 'SUCCESS',
                    user: identity
                }
                return res.status(200).json(response)
            }
        })
    } catch (error) {
        let response = {
            status: 'FAILED',
            errors: error
        }
        return res.status(400).json(response)
    }
}