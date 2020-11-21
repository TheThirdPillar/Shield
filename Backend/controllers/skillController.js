const { validationResult } = require('express-validator')
const uuid4 = require('uuid4')

/* Data models */
const Skill = require('../models/skill')

exports.searchSkill = (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'FAILED', errors: errors.array(), message: 'Please try again with a different email address.' })
    }

    try {

        let searchedSkill = req.query['search']
        Skill.find({name: { $regex: '.*' + searchedSkill + '.*' }}, (error, result) => {
            if (error) {
                return res.status(500).json({status: 'FAILED', error: error})
            } else {
                return res.status(200).json({status: 'SUCCESS', result: result})
            }
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