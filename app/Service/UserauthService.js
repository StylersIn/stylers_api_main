var BaseRepository = require('../Repository/BaseRepository');
var User = require('../Model/user');
var mailer = require('../Middleware/mailer')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var UserRepo = new BaseRepository(User);
var secret = process.env.Secret;
exports.RegisterUser = (Options) => {
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
            CreatedAt: new Date()
        }
        User.findOne({ email: u.email }).then(exists => {
            if (exists) {
                reject({ success: false, message: 'Sorry user already exists' });
            } else {
                UserRepo.add(u).then(created => {
                    if (created) {
                        getUserDetail(created, created.publicId).then(userdetail => {
                            generateToken(userdetail).then((token) => {
                                resolve({ success: true, data: { user: created, token: token }, message: 'Registration Successful' })
                            }).catch((err) => {
                                reject({ success: false, data: err, message: 'could not authenticate user' })
                            })
                        })
                        // mailer.UserAdded(u.email, u.statusCode).then(sent => {
                        //     if (!sent) {
                        //         resolve({ success: false, message: 'User Registration error' });
                        //     } else {
                        //         getUserDetail(created, created.publicId).then(userdetail => {
                        //             generateToken(userdetail).then((token) => {
                        //                 resolve({ success: true, data: { user: created, token: token }, message: 'Registration Successful' })
                        //             }).catch((err) => {
                        //                 reject({ success: false, data: err, message: 'could not authenticate user' })
                        //             })
                        //         })
                        //     }
                        // })
                    } else {
                        resolve({ success: false, message: 'User SignUp was not successfull' });

                    }
                })

            }
        }).catch(err => {
            reject(err);
        })

    })
}

function authenticateuser(email, password) {
    return new Promise((resolve, reject) => {
        console.log('i reach here', email);
        if (email.length == 0 || password.length == 0) {
            reject({ success: false, message: 'authentication credentials incomplete' });
        } else {
            UserRepo.getSingleBy({ email: email }, '').then((user) => {
                if (!user) {
                    reject({ success: false, message: 'Wrong username or password' });
                } else {
                    var validPassword = bcrypt.compareSync(password, user.password);
                    if (validPassword) {
                        if (user.status == false) {
                            resolve({ success: false, message: 'Please Verify your account ' });
                        } else {
                            getUserDetail(user, user.publicId).then(userdetail => {
                                generateToken(userdetail).then((token) => {
                                    resolve({ success: true, data: { user, token: token }, message: 'authentication successful' })
                                }).catch((err) => {
                                    reject({ success: false, data: err, message: 'could not authenticate user' })
                                })
                            })
                        }
                    } else {
                        reject({ success: false, message: 'Incorrect email or password' })
                    }
                }
            }).catch((err) => {
                reject(err);
            })
        }
    })
}
exports.authenticateuser = authenticateuser

exports.verifyAccount = (email, Token) => {
    return new Promise((resolve, reject) => {
        User.findOne({ $and: [{ email: email }, { statusCode: Token }] }).then(data => {
            if (data) {
                var userId = data._id
                return User.findByIdAndUpdate({ _id: userId }, { status: true }, function (err, updated) {
                    if (err) resolve({ status: false, message: 'Error Verifying User' })
                    resolve({ status: true, message: 'User has been verified ' })
                })
            }
            resolve({ status: false, message: 'Invalid token supplied' })
        }).catch(err => {
            reject(err)
        })
    })
}

exports.verifySocial = (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }).then((data, err) => {
            if (data) {
                if (data.type === 'social-login') {
                    resolve({ status: 0, message: 'User account was created with social media' })
                }
                resolve({ status: 1, message: 'Sorry, user account was not created with social media' })
            }
            if (err) resolve({ status: false, message: 'Error Verifying User' })
            resolve({ status: true, message: 'Sorry, user account does not exist' })
        }).catch(err => {
            reject(err)
        })
    })
}

exports.updateProfile = function (id, data) {
    return new Promise((resolve, reject) => {
        UserRepo.updateByQuery({ publicId: id }, data).then(updated => {
            if (updated) {
                UserRepo.getById(updated._id)
                    .then(user => resolve({ success: true, data: user, message: "your profile was updated successfully" }))
                    .catch(err => resolve({ success: false, data: err, message: "unable to update user Profile" }))
            }
        }).catch(err => {
            reject({ success: false, data: err, message: "could not update profile" });
        });
    })
}

function getUserDetail(user, Id) {
    return new Promise((resolve, reject) => {
        //console.log('this is user detail', user.status);
        UserRepo.getSingleBy({ publicId: Id }, { "_id": 0, "__v": 0 }).then(data => {
            var specificUserDetail = { email: user.email, name: user.name, phone: user.phoneNumber, publicId: user.publicId, role: user.role, };
            resolve(specificUserDetail);
        }).catch(error => reject(error))

    })
}

function generateToken(data = {}) {
    return new Promise((resolve, reject) => {
        jwt.sign({ ...data }, secret, { expiresIn: '24hrs' }, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    })
}

exports.generateToken = generateToken;

function verifyToken(token = "") {
    return new Promise((resolve, reject) => {
        jwt.verify(token.replace("Bearer", ""), secret, function (err, decodedToken) {
            if (err) {
                reject(err);
            } else {
                resolve(decodedToken);
            }
        });
    });
};
exports.verifyToken = verifyToken;
