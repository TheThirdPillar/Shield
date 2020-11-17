const { validationResult } = require('express-validator')

/* Application chaincodes */
const identity = require('../chaincode/identity')

/* Data models */
var Application = require('../models/application')

exports.registerApplication = (req, res) => {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({status: 'FAILED', errors: errors.array()})
    }

    try {
        let application = new Application({
            appName: req.body.appName,
            appId: req.body.appId,
            owner: req.user._id
        })
        application.save((error, application) => {
            if (error) {
                return res.status(500).json({status: 'FAILED', message: 'Failed to register community at the moment.'})
            }
            return res.status(200).json({status: 'SUCCESS', message: 'Successfully registered the application.'})
        })
    } catch (error) {
        return res.status(500).json({status: 'FAILED', error: error})
    }
}

exports.applicationGetter = (req, res) => {
    // TODO: If we automate this, we are golden
    try {
        if (req.params['appId'] === 'identity') {
            if (req.params['functionName'] === 'searchApplicationUserByUsername') {
                let searchedUsername = req.query['search']
                let applicationId = req.params['appId']
                if (!searchedUsername) return res.status(400).json({status: "FAILED", message: "Please provide username in request body."})

                identity.searchApplicationUserByUsername(searchedUsername, applicationId, (response) => {
                    return res.status(200).json(response)
                })
            } else {
                return res.status(400).json({status: 'FAILED', message: 'Invalid function name'})
            }
        } else {
            return res.status(400).json({status: 'FAILED', message: 'Invalid application id'})
        }
    } catch (error) {
        return res.status(500).json({status: 'FAILED', error: error })
    }
}

exports.applicationSetter = (req, res) => {
    // This is to handle post requests, 
    // TODO: Automated discovery
    try {
        if (req.params['appId'] === 'identity') {
            if (req.params['functionName'] === 'registerUser') {
                let userData = req.body.data
                let applicationId = req.params['appId']
                identity.registerUser(userData, applicationId, (response) => {
                    return res.status(200).json(response)
                })
            } else {
                return res.status(400).json({status: 'FAILED', message: 'Invalid function name'})
            }
        } else {
            return res.status(400).json({status: 'FAILED', message: 'Invalid application id'})
        }
    } catch (error) {
        return res.status(500).json({status: 'FAILED', error: error })
    }
}