var authService = require('../Service/authService');
var BaseRepository = require('../Repository/BaseRepository');
var Client = require('../Model/clients');
var Stylist = require('../Model/stylists');
var ClientRepo = new BaseRepository(Client);
var StylistRepo = new BaseRepository(Stylist);

exports.authenticate = function(req,res,next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        authService.verifyToken(token, userType = '').then(decoded =>{
            if(decoded.userType === 'client'){
                ClientRepo.getSingleBy({publicId:decoded.publicId}, '').then(data =>{
                    if(data == null){
                        res.status(401).send({success:false, message: "User does not exist" });
                    }else{
                        req.auth ={
                            userId:data.userId,
                            publicId:data.publicId,
                            userType:decoded.userType,
                            email:decoded.email,
                            fullName:decoded.fullName,
                            Id:data._id
                        }
                        if(userType !=='' && userType.length > 0){
                            if(userType != decoded.userType)res.status(401).send({success:false , message: "Invalid token", data:err})
                        }
                        res.locals.response = {data: decoded , message:"", success:true};
                        next();
                    }
                })
            }else if(decoded.userType === 'stylist'){
                StylistRepo.getSingleBy({publicId:decoded.publicId},'').then(data =>{
                    if(data == null){
                        res.status(401).send({success:false , message: "User does not exist"});
                    }else{
                        req.auth = {
                            userId:data.userId,
                            publicId:data.publicId,
                            userType:decoded.userType,
                            email:decoded.email,
                            fullName:decoded.fullName,
                            Id:data._id
                        }
                        console.log(req.auth , 'auth details')
                        res.locals.response = {data:decoded , message:"" , success:true};
                        next();
                    }
                });
            }
        }).catch(err =>{
            res.status(401).send({ success: false, message: "Invalid token", data: err });
 
        })
    }else{
        res.status(401).send({ success: false, message: "No token provided" });
 
    }
}