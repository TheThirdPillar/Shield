var express = require('express')
var router = express.Router()
var passport = require('passport')
const { body, param, query } = require('express-validator')

/* Data models */
var Application = require('../models/application')

/* Controllers */
var applicationController = require('../controllers/applicationController')

/* Custom functions */
var isVerifiedSignature = (req, res, next) => {
    passport.authenticate('publicKeySignature', (error, user, info) => {
        if (error) return res.status(500).json({status: 'FAILED', message: 'Unable to authenticate at the moment.'})
        if (!user) return res.status(401).json({status: 'FAILED', message: 'Invalid signature or user not found.'})
        req.user = user
        return next()
    })(req, res, next)
}

// We only want to allow a certain users
// such as admin of communities to be able to
// register an application.
// TODO: Requires update and more thought
// TODO: Signature exists in body
router.post('/', [
    body('appName')
        .notEmpty()
        .trim()
        .escape(),
    body('appId')
        .notEmpty()
        .trim()
        .escape()
        .custom((value) => {
            return Application.findApplicationById(value).then((application) => {
                if (application) {
                    return Promise.reject('Application with this id is already registered.')
                }
            })
        }),
    body('publicKey')
        .notEmpty()
], isVerifiedSignature, applicationController.registerApplication)


router.get('/listen/:appId/:functionName', [
    param('appId')
        .notEmpty(), // TODO: Add a custom verified to check app exists
    param('functionName')
        .notEmpty(), // TODO: Function should be registered with the above returned application
    query('search')
        .notEmpty()
], applicationController.applicationGetter)


router.post('/listen/:appId/:functionName', [
    param('appId')
        .notEmpty(), // TODO: Add a custom verified to check app exists
    param('functionName')
        .notEmpty(), // TODO: Function should be registered with the above returned application
    body('data')
        .notEmpty()
], applicationController.applicationSetter)

module.exports = router