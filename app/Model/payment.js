var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var paymentSchema = new Schema({
    fullName:{type:String , required:true},
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'user', autopopulate: true },
    CreatedAt:{type:Date}


})

module.exports = mongoose.model('payment', paymentSchema);