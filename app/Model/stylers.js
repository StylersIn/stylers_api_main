var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stylersSchema = new Schema({
    userId:{type: mongoose.Types.ObjectId , ref: 'user', autopopulate: true },
    publicId:{type: mongoose.Types.ObjectId},
    address:{type:String , required:true},
    description:{type:String , required:true},
    IsVerified:{type:Boolean},
    services: [{
    serviceId: { type: mongoose.SchemaTypes.ObjectId, ref: 'services', autopopulate: true },
    adult:{type:Number} ,   
    child:{type:Number}     
    }],
    CreatedAt:{type:Date},


})
module.exports = mongoose.model('stylers', stylersSchema);
