var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    fullName:{type:String , required:true},
    email:{type:String , required:true, unique:true},
    phoneNumber:{type:String , required:true},
    publicId:{type: mongoose.Types.ObjectId},
    statusCode:{type: Number , required:true},
    gender:{type:String , required:true},
    password:{type:String, required:true},
    status:{type:Boolean, required:true},
    imageUrl: {type: String, default:''},
    imageID: {type: String, default: ''},
    CreatedAt:{type:Date}
    
})

module.exports = mongoose.model('user', userSchema);