var BaseRepository = require('../Repository/BaseRepository');
var Styler = require('../Model/stylers');
var client = require('../Model/user');
var mailer = require('../Middleware/mailer');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var booking = require('../Model/booking');
var user = require('../Model/user');
var StylerRepo = new BaseRepository(Styler);
var ClientRepo = new BaseRepository(client);
var secret = process.env.Secret;
exports.RegisterUser = (Options) => {
    return new Promise((resolve, reject) => {
        let hash = bcrypt.hashSync(Options.password, 10);
        var b = {
            name: Options.name,
            email: Options.email,
            phoneNumber: Options.phoneNumber,
            password: hash,
            publicId: Options.publicId,
            startingPrice: Options.startingPrice,
            CreatedAt: new Date(),
            role: 'styler'
        }
        client.findOne({ email: b.email }).then(exists => {
            if (exists) {
                reject({ success: false, message: 'Sorry user already exists' });
            } else {
                ClientRepo.add(b).then(created => {
                    if (created) {
                        var u = Object.assign(Options, { userId: created._id, created: created.publicId, CreatedAt: new Date() })
                        StylerRepo.add(u).then(added => {
                            if (added) {
                                // mailer.StylerReg(b.email).then(sent => {
                                //     if (!sent) {
                                //         resolve({ success: false, message: 'Registration error' });
                                //     } else {
                                //         // resolve({ success: true, message: 'Registration Successful' });

                                //     }
                                // })
                                getUserDetail(created, created.publicId).then(userdetail => {
                                    generateToken(userdetail).then((token) => {
                                        resolve({ success: true, data: { user: created, token: token }, message: 'Registration Successful' })
                                    }).catch((err) => {
                                        reject({ success: false, data: err, message: 'could not authenticate user' })
                                    })
                                })
                            } else {
                                resolve({ success: true, message: 'Error signing styler up ' });
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
        if (username.length == 0 || password.length == 0) {
            resolve({ success: false, message: 'authentication credentials incomplete' });
        } else {
            client.findOne({ email: username }, '').then((user) => {
                if (!user) {
                    resolve({ success: false, message: 'user not found' });
                } else {
                    Styler.findOne({ userId: user._id }).then(data => {
                        if (!data) {
                            resolve({ success: false, message: 'styler not found' });
                        } else {
                            var stylerVerified = data.IsVerified
                            if (stylerVerified == false) {
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
                    })

                }
            }).catch((err) => {
                reject(err);
            })
        }
    })
}
exports.authenticateuser = authenticateuser

exports.StylerRegStatus = (Id) => {
    return new Promise((resolve, reject) => {
        Styler.findOne({ userId: Id }).then(result => {
            if (result && result.services.length) {
                resolve({ success: true, message: 'Styler Service has been updated!' });
            } else {
                resolve({ success: false, message: 'Styler Service has not been updated!' });
            }
        }).catch(err => {
            reject(err)
        })
    })
}

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


exports.FavouriteStyler = (userid, stylerId) => {
    return new Promise((resolve, reject) => {
        Styler.findOne({ publicId: stylerId, favorites: userid }).then(found => {
            if (!found) {
                Styler.findOneAndUpdate({ publicId: stylerId }, { $push: { 'favorites': userid } }).exec((err, data) => {
                    if (err) {
                        reject({ success: false, message: err });
                    } else if (data) {
                        Styler.findOne({ publicId: stylerId }).then(data => {
                            resolve({ success: true, message: 'Styler added as favourite', data: data.favorites.length })
                        })

                    } else {
                        resolve({ success: false, message: 'Service not available on styler list ' });
                    }
                })
            } else {
                Styler.findOne({ publicId: stylerId }).then(data => {
                    resolve({ success: true, message: 'Sorry you already added this styler as your favourite', data: data.favorites.length })
                })
            }
        }).catch(err => {
            reject(err);
        })
    })
}

exports.reviewStyler = (stylerId, Option) => {
    return new Promise((resolve, reject) => {
        Styler.findOneAndUpdate({ publicId: stylerId }, { $push: { review: Option } }).exec((err, updated) => {
            if (err) {
                reject({ success: false, message: err });
            } else if (updated) {
                resolve({ success: true, message: 'Styler review made successfully' })
            } else {
                resolve({ success: false, message: 'Could review styler !!' })
            }
        })
    })
}

exports.UpdateServicePrice = function (id, data) {
    return new Promise((resolve, reject) => {
        StylerRepo.updateByQuery({ userId: id }, {
            $set: {
                'services': data
            }
        }).then(updated => {
            if (updated) {
                resolve({ success: true, message: 'stylers service updated successfully', data: updated })
            } else {
                resolve({ success: true, message: 'unable to update styler service ', data: updated })
            }
        }).catch(err => {
            reject({ success: false, data: err, message: "could not update styler service" });
        });
    })
}

exports.getStylers = (pagenumber = 1, pagesize = 20) => {
    return new Promise((resolve, reject) => {
        Styler.find({}).skip((parseInt(pagenumber - 1) * parseInt(pagesize))).limit(parseInt(pagesize))
            .populate({ path: "services.serviceId", model: "services", select: { _id: 0, __v: 0 } })
            .populate({ path: "userId", model: "user", select: { _id: 0, __v: 0 } })
            .populate({ path: "review.userId", model: "user", select: { _id: 0, __v: 0, password: 0, publicId: 0, statusCode: 0, status: 0, CreatedAt: 0 } })
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


exports.getStylerById = (stylerId) => {
    return new Promise((resolve, reject) => {
        Styler.findById({ _id: stylerId })
            .populate({ path: "services.serviceId", model: "services", select: { _id: 0, __v: 0 } })
            .populate({ path: "userId", model: "user", select: { _id: 0, __v: 0 } })
            .populate({ path: "review.userId", model: "user", select: { _id: 0, __v: 0, password: 0, publicId: 0, statusCode: 0, status: 0, CreatedAt: 0 } })
            .exec((err, stylers) => {
                if (err) reject(err);
                if (stylers) {

                    resolve({ success: true, message: 'styler found', data: stylers })
                } else {
                    resolve({ success: false, message: 'Unable to find what you searched for !!' })
                }
            });
    });
}

exports.sortStylers = () => {
    return new Promise((resolve, reject) => {
        Styler.find()
            .populate({ path: "services.serviceId", model: "services", select: { _id: 0, __v: 0 } })
            .populate({ path: "userId", model: "user", select: { _id: 0, __v: 0 } })
            .populate({ path: "review.userId", model: "user", select: { _id: 0, __v: 0, password: 0, publicId: 0, statusCode: 0, status: 0, CreatedAt: 0 } })
            .exec((err, found) => {
                if (err) reject(err);
                if (found) {
                    var maps = found.sort(function (a, b) {
                        return b.favorites.length - a.favorites.length;

                    })
                    resolve({ success: true, message: 'stylers found', data: maps })

                } else {
                    resolve({ success: false, message: 'Could  not find data' })
                }
            })
    })
}

exports.sortStylersByPrice = (serviceId) => {
    return new Promise((resolve, reject) => {
        Styler.find({ 'services.serviceId': serviceId })
            .populate({ path: "services.serviceId", model: "services", select: { _id: 0, __v: 0 } })
            .populate({ path: "userId", model: "user", select: { _id: 0, __v: 0 } })
            .populate({ path: "review.userId", model: "user", select: { _id: 0, __v: 0, password: 0, publicId: 0, statusCode: 0, status: 0, CreatedAt: 0 } })
            .sort({ startingPrice: 1 })
            .exec((err, found) => {
                if (err) reject(err);
                if (found) {
                    resolve({ success: true, message: 'stylers found', data: found })
                } else {
                    resolve({ success: false, message: 'Could  not find data' })
                }
            })
    })
}

exports.sortStylersByRating = (serviceId) => {
    return new Promise((resolve, reject) => {
        Styler.find({ 'services.serviceId': serviceId })
            .populate({ path: "services.serviceId", model: "services", select: { _id: 0, __v: 0 } })
            .populate({ path: "userId", model: "user", select: { _id: 0, __v: 0 } })
            .populate({ path: "review.userId", model: "user", select: { _id: 0, __v: 0, password: 0, publicId: 0, statusCode: 0, status: 0, CreatedAt: 0 } })
            .sort({ "ratings.rating": -1 })
            .exec((err, found) => {
                if (err) reject(err);
                if (found) {
                    resolve({ success: true, message: 'stylers found', data: found })

                } else {
                    resolve({ success: false, message: 'Could  not find data' })
                }
            })
    })
}



exports.updateProfile = function (id, data) {
    return new Promise((resolve, reject) => {
        user.update({ publicId: id }, data).then(updated => {
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


exports.GetStylerByService = (serviceId, pagenumber = 1, pagesize = 20) => {
    return new Promise((resolve, reject) => {
        Styler.find({ "services.serviceId": { $in: serviceId } })
            .skip((parseInt(pagenumber - 1) * parseInt(pagesize))).limit(parseInt(pagesize))
            .populate({ path: "userId", model: "user", select: { __v: 0 } })
            .populate({ path: "services.serviceId", model: "services", select: { __v: 0 } })
            .populate({ path: "review.userId", model: "user", select: { name: 1 } })
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

exports.GetStylerByFavorite = (serviceId, pagenumber = 1, pagesize = 20) => {
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

exports.getStylerTotalAmount = (data) => {
    return new Promise((resolve, reject) => {
        booking.find({ $and: [{ stylerId: data }, { completed: true }, { accepted: true }] }).then(found => {
            if (found) {
                booking.find({ $and: [{ stylerId: data }, { completed: true }, { accepted: true }] }).count((err, total) => {
                    if (err) reject(err)
                    var a = found.map(b => b.totalAmount)
                    let sumTotal = a.reduce((c, d) => c + d, 0)
                    resolve({ success: true, message: 'total amount', totalAmount: sumTotal, clients: total })
                })
            } else {
                resolve({ success: false, message: ' Styler sum total not found !!!' })
            }

        }).catch(err => {
            reject(err);
        })
    })
}

exports.updateStylerLocation = (location, Id) => {
    return new Promise((resolve, reject) => {
        booking.updateByQuery({ userId: Id }, { stylerLocation: location }).then(result => {
            if (result) {
                resolve({ success: true, message: 'styler current location', })
            } else {
                resolve({ success: false, message: ' Styler sum total not found !!!' })
            }

        }).catch(err => {
            reject(err);
        })
    })
}

exports.GetStylersServices = (Id) => {
    return new Promise((resolve, reject) => {
        Styler.findOne({ userId: Id })
            .populate({ path: "services.serviceId", model: "services", select: { _id: 0, __v: 0 } })
            // .populate({ path: "services.subServiceId", model: "services", select: { _id: 0, __v: 0 } })
            // .populate({ path: "services.subServiceId", model: "services" })
            .then(result => {
                if (result) {
                    resolve({ success: true, message: 'styler services', data: result.services, })
                } else {
                    resolve({ success: false, message: 'Error while fetching styler service' })
                }

            }).catch(err => {
                reject(err);
            })
    })
}