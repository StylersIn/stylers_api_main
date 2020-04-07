var BaseRepository = require("../Repository/BaseRepository");
var User = require("../Model/user");
var mailer = require("../Middleware/mailer");
var jwt = require("jsonwebtoken");
var sms = require("../Middleware/sms");
var bcrypt = require("bcryptjs");
var mailer = require("../Middleware/mailer");
var UserRepo = new BaseRepository(User);
var secret = process.env.Secret;
exports.RegisterUser = Options => {
  return new Promise((resolve, reject) => {
    let hash = bcrypt.hashSync(Options.password, 10);
    var u = {
      name: Options.name,
      email: Options.email,
      phoneNumber: Options.phoneNumber,
      password: hash,
      gender: Options.gender,
      publicId: Options.publicId,
      statusCode: Options.statusCode,
      status: false,
      type: Options.type,
      CreatedAt: new Date(),
      passwordToken: 1111
    };

    User.findOne({ $or:[{email: u.email},{phoneNumber:u.phoneNumber}] })
      .then(exists => {
        if (exists) {
          reject({ success: false, message: "Sorry user already exists" });
        } else {
          UserRepo.add(u).then(created => {
            if (created) {
              getUserDetail(created, created.publicId).then(userdetail => {
                generateToken(userdetail)
                  .then(token => {
                    sms.sendToken(u.phoneNumber,u.statusCode).then(done =>{
                      if(done){
                        resolve({
                          success: true,
                          data: { user: created, token: token },
                          message: "Registration Successful"
                        });
                      }else if(!done){
                        mailer.MailSender(u.email,u.statusCode).then(sent =>{
                          if(sent){
                            resolve({
                                      success: true,
                                      data: { user: created, token: token },
                                      message: "Registration Successful"
                                    });
                          }else{
                            resolve({
                                      success: false,
                                      message: "Error occured while registering user !!"
                                    });
                          }
                        }).catch(err =>{
                          reject(err);
                        })
                      }else{
                        resolve({
                          success: false,
                          message: "Error occured while registering user !!"
                        });
                      }
                    }).catch(err => reject(err))
                  })
                  .catch(err => {
                    reject({
                      success: false,
                      data: err,
                      message: "could not authenticate user"
                    });
                  });
              }).catch(err =>{
                reject(err);
              })
            } else {
              resolve({
                success: false,
                message: "User SignUp was not successfull"
              });
            }
          }).catch(err =>{
            reject(err);
          });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

function authenticateuser(email, password) {
  return new Promise((resolve, reject) => {
    console.log("i reach here", email);
    if (email.length == 0 || password.length == 0) {
      reject({
        success: false,
        message: "authentication credentials incomplete"
      });
    } else {
      UserRepo.getSingleBy({ email: email }, "")
        .then(user => {
          if (!user) {
            reject({ success: false, message: "Wrong username or password" });
          } else {
            var validPassword = bcrypt.compareSync(password, user.password);
            if (validPassword) {
              if (user.status == false) {
                resolve({
                  status: false,
                  message: "Please Verify your account "
                });
              } else {
                getUserDetail(user, user.publicId).then(userdetail => {
                  generateToken(userdetail)
                    .then(token => {
                      resolve({
                        success: true,
                        data: { user, token: token },
                        message: "authentication successful"
                      });
                    })
                    .catch(err => {
                      reject({
                        success: false,
                        data: err,
                        message: "could not authenticate user"
                      });
                    });
                });
              }
            } else {
              reject({
                success: false,
                message: "Incorrect email or password"
              });
            }
          }
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}
exports.authenticateuser = authenticateuser;

exports.forgotPasswordToken = data => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: data.email })
      .then(found => {
        if (found) {
          mailer.forgortPasswordMailer(data.email, data.passwordToken)
            .then(sent => {
              if (sent) {
                User.updateOne(
                  { email: found.email },
                  { passwordToken: data.passwordToken },
                  function(err, updated) {
                    if (err) reject(err);
                    if (updated) {
                      resolve({
                        success: true,
                        message:
                          "Please check your email for verification code "
                      });
                    } else {
                      resolve({
                        success: true,
                        message: "Error sending verification code !!! "
                      });
                    }
                  }
                );
              } else {
                resolve({ success: false, message: "Error sending sms !!!" });
              }
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve({ success: false, message: "Could not find user" });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.changeforgotPassword = Options => {
  return new Promise((resolve, reject) => {
    User.findOne({ passwordToken: Options.passwordToken })
      .then(found => {
        if (found) {
          let hash = bcrypt.hashSync(Options.password, 10);
          User.updateOne({ email: found.email }, { password: hash })
            .then(updated => {
              if (updated) {
                resolve({
                  success: true,
                  message: "User password updated Successfully !!!"
                });
              } else {
                resolve({
                  success: false,
                  message: "Unable to update user password !!!"
                });
              }
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve({ success: false, message: "invalid token inserted " });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.changepassword = (data)=>{

  return new Promise((resolve , reject)=>{
    User.findOne({email:data.email}).then(found =>{
      if(found){
        var IsValid = bcrypt.compareSync(data.originalPassword , found.password)
        if(IsValid == true){
          var newpassword = data.password
          var hashNewPassword = bcrypt.hashSync(newpassword ,10)
          User.updateOne({email:data.email},{password:hashNewPassword}).then(updated =>{
            if(updated){
              resolve({success:true , message:'password has been changed successfully !!'})
            }else{
              resolve({success:false , message:'Error encountered while updating password '})
            }
          }).catch(err =>{
            reject(err);
          })
        }
      }
    }).catch(err =>{
      reject(err);
    })
  })
}

exports.verifyAccount = (email, Token) => {
  return new Promise((resolve, reject) => {
    User.findOne({ $and: [{ email: email }, { statusCode: Token }] })
      .then(data => {
        if (data) {
          var userId = data._id;
          return User.findByIdAndUpdate(
            { _id: userId },
            { status: true },
            function(err, updated) {
              if (err)
                resolve({ status: false, message: "Error Verifying User" });
              getUserDetail(updated, updated.publicId).then(userDetail => {
                generateToken(userDetail)
                  .then(token => {
                    // resolve({ status: true, message: 'User has been verified', data: { user: updated, token: token } })
                    resolve({
                      success: true,
                      data: { user: userDetail, token: token },
                      message: "authentication successful"
                    });
                  })
                  .catch(err => {
                    reject({
                      success: false,
                      data: err,
                      message: "could not authenticate user"
                    });
                  });
              });
            }
          );
        }
        resolve({ status: false, message: "Invalid token supplied" });
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.verifySocial = email => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .then((user, err) => {
        if (user) {
          if (user.type === "social-login") {
            if (user.status == false) {
              resolve({
                status: false,
                message: "Please Verify your account "
              });
            } else {
              getUserDetail(user, user.publicId).then(userdetail => {
                generateToken(userdetail)
                  .then(token => {
                    resolve({
                      success: true,
                      data: { user, token: token },
                      message: "authentication successful"
                    });
                  })
                  .catch(err => {
                    reject({
                      success: false,
                      data: err,
                      message: "could not authenticate user"
                    });
                  });
              });
            }
          } else {
            resolve({
              success: false,
              message: "Sorry, user account was not created with social media"
            });
          }
        } else {
          if (err) resolve({ success: false, message: "Error Verifying User" });
          reject({
            socialAccount: false,
            message: "Sorry, user account does not exist"
          });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.updateProfile = function(id, data) {
  return new Promise((resolve, reject) => {
    UserRepo.updateByQuery({ publicId: id }, data)
      .then(updated => {
        if (updated) {
          UserRepo.getById(updated._id)
            .then(user =>
              resolve({
                success: true,
                data: user,
                message: "your profiles was updated successfully"
              })
            )
            .catch(err =>
              resolve({
                success: false,
                data: err,
                message: "unable to update user Profile"
              })
            );
        }
      })
      .catch(err => {
        reject({
          success: false,
          data: err,
          message: "could not update profile"
        });
      });
  });
};

function getUserDetail(user, Id) {
  return new Promise((resolve, reject) => {
    //console.log('this is user detail', user.status);
    UserRepo.getSingleBy({ publicId: Id }, { _id: 0, __v: 0 })
      .then(data => {
        var specificUserDetail = {
          email: user.email,
          name: user.name,
          phone: user.phoneNumber,
          publicId: user.publicId,
          role: user.role
        };
        resolve(specificUserDetail);
      })
      .catch(error => reject(error));
  });
}

function generateToken(data = {}) {
  return new Promise((resolve, reject) => {
    jwt.sign({ ...data }, secret, { expiresIn: "24hrs" }, function(err, token) {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

exports.generateToken = generateToken;

function verifyToken(token = "") {
  return new Promise((resolve, reject) => {
    jwt.verify(token.replace("Bearer", ""), secret, function(
      err,
      decodedToken
    ) {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    });
  });
}

exports.getUserData = function(Id) {
  return new Promise((resolve, reject) => {
    UserRepo.getSingleBy({ publicId: Id }, { _id: 0, __v: 0 })
      .then(user =>
        resolve({ success: true, data: user, message: "user details" })
      )
      .catch(err =>
        reject({
          success: false,
          data: err,
          message: "unable to fetch user details"
        })
      );
  });
};

exports.fetchCards = function(Id) {
  return new Promise((resolve, reject) => {
    UserRepo.getById(Id)
      .then(user =>
        resolve({
          success: true,
          data: user.cards,
          message: "user saved cards"
        })
      )
      .catch(err =>
        reject({
          success: false,
          data: err,
          message: "unable to fetch user cards"
        })
      );
  });
};

exports.verifyToken = verifyToken;
