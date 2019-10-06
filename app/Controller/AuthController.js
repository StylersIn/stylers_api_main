var userService = require('../Service/authService');
//cloudinary = require('../middlewares/Cloudinary')
var mongoose = require('mongoose');
var rand = require('random-number');
var gen = rand.generator({
  min:  1000
, max:  100000
, integer: true
})

module.exports = function authController(){
    this.register = (req,res, next)=>{
        var Options ={
            fullName:req.body.fullname,
            publicId: mongoose.Types.ObjectId(),
            statusCode: gen(),
            email:req.body.email,
            phoneNumber:req.body.phonenumber,
            password:req.body.password,
            userType:req.body.usertype,
            status:false
        }
        userService.RegisterUser(Options).then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.json(err);
        })
    }

    this.authenticate = function(req, res, next){
        var username = req.body.username
        var password = req.body.password
        userService.authenticateuser(username,password)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
    }

  
}