var mongoose = require('mongoose')
var Schema = mongoose.Schema

var TransactionSchema = new Schema({
    from: {type: Schema.Types.ObjectId, required: true},
    to: {type: Schema.Types.ObjectId, required: true},
    amount: {type: Number, min: [0, 'Amount cannout be negative']},
    transactionDate: {type: Date, default: Date.now()},
    message: {type: String}
})

module.exports = mongoose.model('Transaction', TransactionSchema)