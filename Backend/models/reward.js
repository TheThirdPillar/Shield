var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RewardSchema = new Schema({
    amount: {type: Number, minimum: [0, 'Amount cannot be negative']}
})

module.exports = mongoose.model('Reward',  RewardSchema)