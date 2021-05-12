var express = require('express')
var router = express.Router()
var passport = require('passport')
const { body, query, param } = require('express-validator')
const uuid4 = require('uuid4')

/* Data models */
var User = require('../models/user')
const VerificationCode = require('../models/verificationcode')
var Application = require('../models/application')
var Identity = require('../models/identity')

/* Controllers */
var userController = require('../controllers/userController')

/* Custom functions */
var isVerifiedSignature = (req, res, next) => {
  passport.authenticate('publicKeySignature', (error, user, info) => {
      if (error) return res.status(500).json({status: 'FAILED', message: 'Unable to authenticate at the moment.'})
      if (!user) return res.status(401).json({status: 'FAILED', message: 'Invalid signature or user not found.'})
      req.user = user
      return next()
  })(req, res, next)
}

router.post('/', [
  // Check if the email is right format
  body('email')
    .isEmail()
    .normalizeEmail()
    .custom((value) => {
      return User.findUserByEmail(value).then((user) => {
        if (user) {
          return Promise.reject('Email already in use.')
        }
      })
    }),
  body('publicKey')
    .notEmpty()
], userController.registerUser)

router.get('/verify', [
  // Check if the query is correct format
  query('code')
    .notEmpty()
    .custom((value) => {
      if (!uuid4.valid(value)) {
        return Promise.reject('Not a valid format for the code')
      }
      return VerificationCode.findCodeByValue(value).then((code) => {
        if (!code) {
          return Promise.reject('Code does not exist')
        }
      })
    })
], userController.verifyUser)

// Request user for private data over email
// This is a temporary block of code. To be removed
// as soon as possible. 
// TODO: Remove later..
// TODO: Move user exists check code here from controller.
router.put('/requestPrivateDataByEmail', [
  body('username')
    .notEmpty(),
  body('email')
    .notEmpty()
    .isEmail(),
  body('profileURL')
    .notEmpty()
], userController.requestPrivateDataByEmail)

// Register a user with an application
// TODO: Signatures are required
router.post('/:id/login', [
  param('id')
      .custom((value) => {
        return Application.findApplicationById(value).then((application) => {
          if (!application) {
              return Promise.reject('This application is not registered with the network')
          }
        })
      }),
  body('publicKey')
      .notEmpty(),
  body('token')
      .notEmpty(),
  body('tokenSignature')
      .notEmpty()
], isVerifiedSignature, userController.loginUserWithApplication)

router.get('/getidentityprofile', [
  query('username')
    .notEmpty() // TODO: Check if username is registered with Identity
], userController.getPublicProfile)

module.exports = router
