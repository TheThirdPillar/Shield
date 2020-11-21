var jwt = require('jsonwebtoken')
var CustomStrategy = require('passport-custom').Strategy

/* Configurations and such */
var tokenSecret = require('../../config/jwt')

/* Data Models */
var User = require('../../models/user')
var UserApplication = require('../../models/userapplication')

var myLocalConfig = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((obj, done) => {
        // TODO: Check and update if required
        // based on session decisions.
        done(null, obj)
    })

    passport.use('publicKeySignature', new CustomStrategy(
        (req, callback) => {
            let publicKey = req.body['publicKey']
            User.findUserByPublicKey(publicKey, (error, user) => {
                if (error) {
                    return callback(error, false)
                }
                if (!user) {
                    return callback(null, false)
                }
                // TODO: ADD Signature verification logic here
                // TODO: Only verified users are allowed to register
                // a community.
                return callback(null, user)
            })
        }
    ))

    passport.use('jwt', new CustomStrategy(
        (req, callback) => {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (token == null) {
                return callback(null, null)
            }  
            jwt.verify(token, tokenSecret.secret, (err, user) => {
                if (err) {
                    return callback(err, null)
                }
                // TODO: Seems unnecessary, maybe store applicationData
                // in the token. Needs some thinking.
                UserApplication.findApplicationDataBySession(token, (error, userapplication) => {
                    if (error) {
                        return callback(error, null)
                    }
                    return callback(null, userapplication)
                })
            })
        }
    ))
}

module.exports = myLocalConfig