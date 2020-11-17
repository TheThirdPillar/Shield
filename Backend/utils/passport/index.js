var CustomStrategy = require('passport-custom').Strategy

/* Data Models */
var User = require('../../models/user')

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

}

module.exports = myLocalConfig