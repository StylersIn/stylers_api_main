var BaseRepository =  require('../Repository/BaseRepository');
var Styler = require('../Model/stylers');
var mailer = require('../Middleware/mailer')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var StylerRepo = new BaseRepository(Styler);
var secret = process.env.Secret;
exports.RegisterUser = (Options)=>{
  return new Promise((resolve, reject)=>{
     let hash = bcrypt.hashSync(Options.password , 10);
      var u = {
         fullName:Options.fullName,
         email:Options.email,
         phoneNumber:Options.phoneNumber,
         password:hash,
         gender:Options.gender,
         publicId:Options.publicId,
         address:Options.address,
         description:Options.description,
         services:Options.services,
         IsVerified:false,
         CreatedAt:new Date()
      }
      Styler.findOne({email:u.email}).then(exists =>{
         if(exists){
         reject({success: false , message:'Sorry user already exists'});
         }else{
            StylerRepo.add(u).then(created =>{
                 if(created){
                    mailer.StylerReg(u.email,u.fullName , function(err , sent){
                        if(err){
                            resolve({ success:false , message:'Registration error'});
                        }else{
                            resolve({ success:true , message:'Registration Successful'});
                        }
                    })
                 }else{
                    resolve({success: false , message:'User SignUp was not successfull'});
 
                 }
             })
           
         }
     }).catch(err =>{
         reject(err);
     })
  
  })
}

function authenticateuser(username, password){
    return new Promise((resolve, reject)=>{
        console.log('i reach here' , username);
        if(username.length == 0 || password.length == 0){
            resolve({ success:false , message:'authentication credentials incomplete'});

        }else{
            StylerRepo.getSingleBy({email: username},'').then((user)=>{
                if(!user){
                    resolve({success:false , message:'could not authenticate user'});
                }else{
                if(user.IsVerified == false){
                    resolve({success:false , message:'Please wait while admin verifies your account  '});
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

exports.verifyAccount = (email , Token)=>{
    return new Promise((resolve , reject)=>{
        User.findOne({$and:[{email:email},{statusCode:Token}]}).then(data =>{
            if(data){
                var userId = data._id
                User.findByIdAndUpdate({_id:userId},{status: true}, function(err , updated){
                    if(err)resolve({status:false , message:'Error Verifying User'})
                    resolve({status:true , message:'User has been verified '})
                })
            }
        }).catch(err =>{
            reject(err)
        })
    })
}

exports.updateProfile = function(id, data){
    return new Promise((resolve, reject)=>{
        StylerRepo.updateByQuery({publicId: id}, data).then(updated =>{
            if(updated){
                StylerRepo.getById(updated._id)
                .then(user => resolve({success:true , data:user , message:"your profile was updated successfully"}))
                .catch(err => resolve({success:false , data:err , message:"unable to update user Profile"}))
            }
        }).catch(err => {
            reject({success: false, data: err, message: "could not update profile"});
        });
    })
}

function getUserDetail(user,Id){
    return new Promise((resolve, reject)=>{
        //console.log('this is user detail', user.status);
        StylerRepo.getSingleBy({publicId:Id}, {"_id" : 0, "__v" : 0}).then(data =>{
                var specificUserDetail = {email: user.email,   phone: user.phoneNumber,  publicId : user.publicId};
                resolve(specificUserDetail);
            }).catch(error => reject(error))
    
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
