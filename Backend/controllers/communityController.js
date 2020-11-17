const { validationResult } = require('express-validator')

/* Data models */
const Community = require('../models/community')

// Function to register a community
exports.registerCommunity = (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'FAILED',
            errors: errors.array()
        })
    }

    try {
        let community = new Community({
            name: req.body.name,
            shortName: req.body.shortName,
            admin: req.user._id
        })
        community.save((error, community) => {
            if (error) {
                return res.status(500).json({status: 'FAILED', message: 'Failed to create the communtity at the moment. Please try again,'})
            }
            return res.status(200).json({status: 'SUCCESS', message: 'Successfully added the community.'})
        })

    } catch (error) {
        return res.status(500).json({status: 'FAILED', error: error})
    }
}