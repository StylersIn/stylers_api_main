var BaseRepository = require('../Repository/BaseRepository');
var Styler = require('../Model/stylers');
var mailer = require('../Middleware/mailer')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var StylerRepo = new BaseRepository(Styler);
var secret = process.env.Secret;
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.RegisterUser = (Options) => {
    return new Promise((resolve, reject) => {
        console.log(Options)
        let hash = bcrypt.hashSync(Options.password, 10);
        var u = {
            fullName: Options.fullName,
            email: Options.email,
            phoneNumber: Options.phoneNumber,
            password: hash,
            gender: Options.gender,
            publicId: Options.publicId,
            address: Options.address,
            description: Options.description,
            IsVerified: false,
            CreatedAt: new Date()
        }
        Styler.findOne({ email: u.email }).then(exists => {
            if (exists) {
                reject({ success: false, message: 'Sorry user already exists' });
            } else {
                StylerRepo.add(u).then(created => {
                    if (created) {
                        mailer.StylerReg(u.email, u.fullName, function (err, sent) {
                            if (err) {
                                resolve({ success: false, message: 'Registration error' });
                            } else {
                                resolve({ success: true, message: 'Registration Successful' });
                            }
                        })
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

function authenticateuser(username, password) {
    return new Promise((resolve, reject) => {
        console.log('i reach here', username);
        if (username.length == 0 || password.length == 0) {
            resolve({ success: false, message: 'authentication credentials incomplete' });

        } else {
            StylerRepo.getSingleBy({ email: username }, '').then((user) => {
                if (!user) {
                    resolve({ success: false, message: 'could not authenticate user' });
                } else {
                    if (user.IsVerified == false) {
                        resolve({ success: false, message: 'Please wait while admin verifies your account  ' });
                    } else {
                        var validPassword = bcrypt.compareSync(password, user.password);
                        if (validPassword) {
                            getUserDetail(user, user.publicId).then(userdetail => {
                                generateToken(userdetail).then((token) => {
                                    resolve({ success: true, data: { user, token: token }, message: 'authentication successful' })
                                }).catch((err) => {
                                    resolve({ success: false, data: err, message: 'could not authenticate user' })
                                })
                            })
                        } else {
                            resolve({ success: false, message: 'incorrect email or password' })

                        }
                    }
                }
            }).catch((err) => {
                reject(err);
            })
        }
    })
}
exports.authenticateuser = authenticateuser



exports.AddServicePrice = (id, Option) => {
    return new Promise((resolve, reject) => {

        Styler.findOne({ publicId: id, "services.serviceId": Option.serviceId }, { 'services.$': 1 }).then(found => {
            if (!found) {
                Styler.findOneAndUpdate({ publicId: id }, { $push: { services: Option } }).exec((err, data) => {
                    if (err) {
                        reject({ success: false, message: err });
                    } else if (data) {
                        resolve({ success: true, message: 'Service price added successfully' })
                    } else {
                        resolve({ success: false, message: 'Could not add service price' })
                    }
                })
            } else {
                resolve({ success: false, message: 'Detail inserted already exists !!!' })
            }
        }).catch(err => {
            reject(err)
        })

    })
}

exports.getStylers = (pagenumber = 1, pagesize = 20) => {
    return new Promise((resolve, reject) => {
        Styler.find({}).skip((parseInt(pagenumber - 1) * parseInt(pagesize))).limit(parseInt(pagesize))
            .populate({ path: "services.serviceId", model: "services", select: { _id: 0, __v: 0 } })
            .exec((err, stylers) => {
                if (err) reject(err);
                if (stylers) {

                    resolve({ success: true, message: 'stylers found', data: stylers })
                } else {
                    resolve({ success: false, message: 'Unable to find what you searched for !!' })
                }
            });
    });
}

exports.updateProfile = function (id, data) {
    return new Promise((resolve, reject) => {
        StylerRepo.updateByQuery({ publicId: id }, data).then(updated => {
            if (updated) {
                StylerRepo.getById(updated._id)
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
        StylerRepo.getSingleBy({ publicId: Id }, { "_id": 0, "__v": 0 }).then(data => {
            var specificUserDetail = { email: user.email, phone: user.phoneNumber, publicId: user.publicId };
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


exports.GetStylerByService = (serviceId, pagenumber = 1, pagesize = 20) => {
    return new Promise((resolve, reject) => {
        Styler.find({ "services.serviceId": { $in: serviceId } })
            .skip((parseInt(pagenumber - 1) * parseInt(pagesize))).limit(parseInt(pagesize))
            .populate({ path: "services.serviceId", model: "services", select: { _id: 0, __v: 0 } })
            .exec((err, stylers) => {
                if (err) reject(err);
                if (stylers) {
                    resolve({ success: true, message: 'stylers found', data: stylers })
                } else {
                    resolve({ success: false, message: 'Unable to find what you searched for !!' })
                }
            });
    })

}