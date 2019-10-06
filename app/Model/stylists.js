var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var stylistsSchema = new Schema({
    fullName:{type:String , required:true},
    email:{type:String , required:true, unique:true},
    phoneNumber:{type:String , required:true},
    publicId:{type: mongoose.Types.ObjectId},
    userId:{type: mongoose.Types.ObjectId},

})

module.exports = mongoose.model('stylists', stylistsSchema);