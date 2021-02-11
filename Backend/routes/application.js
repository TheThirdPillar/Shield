var express = require('express')
var router = express.Router()
var passport = require('passport')
const { body, param } = require('express-validator')

/* Data models */
var Application = require('../models/application')

/* Controllers */
var applicationController = require('../controllers/applicationController')

/* Custom functions */
var isAuthenticated = (req, res, next) => {
    passport.authenticate(['publicKeySignature', 'jwt'], (error, user, info) => {
        if (error) return res.status(500).json({status: 'FAILED', message: 'Unable to authenticate at the moment.'})
        if (!user) return res.status(401).json({status: 'FAILED', message: 'Invalid signature/token or user not found.'})
        req.user = user
        return next()
    })(req, res, next)
}

// Multer Setup
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.fieldname)
  }
})
var upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024, fieldSize: 50 * 1024 * 1024 } })

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
], isAuthenticated, applicationController.registerApplication)

// Profile picture upload
router.post('/listen/profile/upload', isAuthenticated, upload.single('picture'), applicationController.profileUpload)

router.get('/listen/:appId/:functionName', [
    param('appId')
        .notEmpty(), // TODO: Add a custom verified to check app exists
    param('functionName')
        .notEmpty() // TODO: Function should be registered with the above returned application
], isAuthenticated, applicationController.applicationGetter)


// Post requests should be authenticated and 
// authentication should append userData to request
router.post('/listen/:appId/:functionName', [
    param('appId')
        .notEmpty(), // TODO: Add a custom verified to check app exists
    param('functionName')
        .notEmpty(), // TODO: Function should be registered with the above returned application
], isAuthenticated, applicationController.applicationSetter)

// Put requests to update application states
// TODO: Update some POST functions to move here
router.put('/listen/:appId/:functionName', [
    param('appId')
        .notEmpty(), // TODO: Add a custom verified to check app exists
    param('functionName')
        .notEmpty() // TODO: Function should be registered with the above returned application - Scope ?
], isAuthenticated, applicationController.applicationPutter)

// Delete request
router.delete('/listen/:appId/:functionName/:object', [
    param('appId')
        .notEmpty(),
    param('functionName')
        .notEmpty(),
], isAuthenticated, applicationController.applicationDeleter)

module.exports = router