var BaseRepository =  require('../Repository/BaseRepository');
var User = require('../Model/user');
var Client = require('../Model/clients');
var Stylers = require('../Model/stylists')
var mailer = require('../Middleware/mailer')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var UserRepo = new BaseRepository(User);
var ClientRepo = new BaseRepository(Client);
var StylersRepo = new BaseRepository(Stylers);
var secret = process.env.Secret;
exports.RegisterUser = (Options)=>{
  return new Promise((resolve, reject)=>{
     let hash = bcrypt.hashSync(Options.password , 10);
      var u = {
         fullName:Options.fullName,
         email:Options.email,
         phoneNumber:Options.phoneNumber,
         password:hash,
         userType:Options.userType,
         publicId:Options.publicId,
         statusCode:Options.statusCode,
         status:Options.status
      }
     User.findOne({email:u.email}).then(exists =>{
         if(exists){
         reject({success: false , message:'Sorry user already exists'});
         }else{
            UserRepo.add(u).then((user)=>{
                var D  = {
                    fullName:Options.fullName,
                    email:Options.email,
                    userId:user._id,
                    publicId:user.publicId,
                    phoneNumber:Options.phoneNumber
                }
            u.userType == 'stylist' ? StylersRepo.add(D) :   ClientRepo.add(D)

            }).then(()=>{
                mailer.UserAdded(u.email,u.fullName ,u.statusCode, function(err , sent){
                    if(err){
                        resolve({ success:false , message:'Registration error'});
                    }else{
                        resolve({ success:true , message:'Registration Successful'});
                    }
                })
       
            }).catch((err)=>{
                reject({success: false , message:'Error Registering user ', data:err});
            })
         }
     })
  
  })
}

function authenticateuser(username, password){
    return new Promise((resolve, reject)=>{
        console.log('i reach here' , username);
        if(username.length == 0 || password.length == 0){
            resolve({ success:false , message:'authentication credentials incomplete'});

        }else{
            UserRepo.getSingleBy({email: username},'').then((user)=>{
                if(!user){
                    resolve({success:false , message:'could not authenticate user'});
                }else{
                if(user.status == 'false'){
                    resolve({success:false , message:'Please Verify your account '});
                }else{
                    var validPassword = bcrypt.compareSync(password, user.password);
                    if(validPassword){
                        getUserDetail(user,user.publicId).then(userdetail =>{
                            generateToken(userdetail).then((token)=>{
                                resolve({success:true , data: {user, token : token }, message: 'authentication successful'})
                            }).catch((err)=>{
                                resolve({success: false, data:err, message:'could not authenticate user'})
                            })
                            })
                    }else{
                        resolve({success: false, message:'incorrect email or password'})
 
                    }
                }
            }
            }).catch((err)=>{
                reject(err);
            })
        }
    })
}
exports.authenticateuser = authenticateuser

function getUserDetail(user,Id){
    return new Promise((resolve, reject)=>{
        //console.log('this is user detail', user.status);
        if(user.userType == 'client'){
            ClientRepo.getSingleBy({publicId:Id}, {"_id" : 0, "__v" : 0}).then(data =>{
                var specificUserDetail = {email: user.email,   phone: user.phoneNumber, userType : user.userType, publicId : user.publicId};
                resolve(specificUserDetail);
            }).catch(error => reject(error))
        }else{
            StylersRepo.getSingleBy({publicId:Id}, {"_id" : 0, "__v" : 0}).then(data =>{
                var specificUserDetail = {email: user.email,   phone: user.phoneNumber, userType : user.userType, publicId : user.publicId};
                userdetail = {...data.toObject(),...specificUserDetail};
                resolve(userdetail);
            }).catch(error => reject(error));
        }
    })
}

function generateToken(data ={}){
    return new Promise((resolve, reject)=>{
        jwt.sign({...data}, secret, {expiresIn: '24hrs'}, function(err, token){
            if(err){
                reject(err);
            }else{
                resolve(token);
            }
        });
    })
}

exports.generateToken = generateToken;

function verifyToken (token= ""){
    return new Promise((resolve, reject)=>{
        jwt.verify(token.replace("Bearer", ""), secret, function(err, decodedToken ){
            if(err){
                reject(err);
            }else{
                resolve(decodedToken);
            }
        });
    });
};
exports.verifyToken = verifyToken;
