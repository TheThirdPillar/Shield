var express = require('express')
var router = express.Router()
var passport = require('passport')
const { body } = require('express-validator')

/* Data models */
var User = require('../models/user')
var Community = require('../models/community')

/* Controllers */
var communityController = require('../controllers/communityController')

/* Custom functions */
var isVerifiedSignature = (req, res, next) => {
    passport.authenticate('publicKeySignature', (error, user, info) => {
        if (error) return res.status(500).json({status: 'FAILED', message: 'Unable to authenticate at the moment.'})
        if (!user) return res.status(401).json({status: 'FAILED', message: 'Invalid signature or user not found.'})
        req.user = user
        return next()
    })(req, res, next)
}

router.get('/', communityController.getAllCommunities)

router.post('/', [
    // Check if the body has both name and shortname
    // TODO: Signature exists in body
    body('name')
        .notEmpty()
        .isLength( { min: 2, max: 20}).withMessage('Community name must be between 2 and 20 characters')
        .trim(),
    body('shortName')
        .notEmpty()
        .isLength( { min: 2, max: 20 }).withMessage("Community id must be between 2 and 20 characters")
        .trim()
        .escape()
        .custom((value) => {
            return Community.findCommunityByShortName(value).then((community) => {
                if (community) {
                    return Promise.reject('Community already registered with this id.')
                }
            })
        }),
    body('publicKey')
        .notEmpty()
], isVerifiedSignature, communityController.registerCommunity)

module.exports = router