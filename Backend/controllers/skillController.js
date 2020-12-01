const { validationResult } = require('express-validator')
const uuid4 = require('uuid4')
const skill = require('../models/skill')

/* Data models */
const Skill = require('../models/skill')

exports.searchSkill = (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'FAILED', errors: errors.array(), message: 'Please try again with a different email address.' })
    }

    try {

        let searchedSkill = req.query['search']
        Skill.find({name: { $regex: '.*' + searchedSkill + '.*' }}, (error, results) => {
            if (error) {
                return res.status(500).json({status: 'FAILED', error: error})
            } else {
                resultsOnlyNames = results.map(result => result.name)
                return res.status(200).json({status: 'SUCCESS', result: resultsOnlyNames})
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

exports.addSkill = (req, res) => {
    
    try {
        let skills = req.body.skills
        Skill.insertMany(skills, function(error, skills) {
            if (error) {
                return res.status(500).json({status: 'FAILED', errors: error})
            } else {
                return res.status(200).json({status: 'SUCCESS', message: "Successfully added skills to the database."})
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