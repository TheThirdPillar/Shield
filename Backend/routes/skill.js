var express = require('express')
var router = express.Router()
var passport = require('passport')
const { body, query } = require('express-validator')

/* Controllers */
var skillController = require('../controllers/skillController')
const { route } = require('.')

/* Custom functions */
var isAuthenticated = (req, res, next) => {
    passport.authenticate(['publicKeySignature', 'jwt'], (error, user, info) => {
        if (error) return res.status(500).json({status: 'FAILED', message: 'Unable to authenticate at the moment.'})
        if (!user) return res.status(401).json({status: 'FAILED', message: 'Invalid signature/token or user not found.'})
        req.user = user
        return next()
    })(req, res, next)
}

router.get('/', [
    query('search')
        .notEmpty()
], isAuthenticated, skillController.searchSkill)

router.post('/', skillController.addSkill)

module.exports = router