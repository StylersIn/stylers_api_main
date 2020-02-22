var model = require('../Model/booking');
var BaseRepo = require('../Repository/BaseRepository');
var styler = require('../Model/stylers');
var service = require('../Model/services');
var bookingFunction = require('../Middleware/bookingAlgo')
var stylersRepo = require('../Repository/BaseRepository');
var BookingRepo = new BaseRepo(model);
const request = require('request');
const user = require('../Model/user');

exports.FindStyler = function (option, pagenumber = 1, pagesize = 20) {
    return new Promise((resolve, reject) => {
        service.find({ name: { $regex: option, $options: 'i' } })
            .exec((err, found) => {
                if (err) { reject(err); }
                if (found == null || Object.keys(found).length === 0) {
                    resolve({ success: false, data: {}, message: "We could not find what you are looking for." })
                } else {
                    var ids = found.map(docs => { return docs._id });
                    styler.find({ "services.serviceId": { $in: ids } })
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
                }
            })
    })
}

exports.BookService = (options) => {
    console.log(options)
    return new Promise((resolve, reject) => {
        var saveCard = options['saveCard'];
        if (saveCard) delete options['saveCard'];
        BookingRepo.add(options).then(created => {
            if (created) {
                request(`https://api.paystack.co/transaction/verify/${options.transactionReference}`,
                    {
                        method: 'GET',
                        json: true,
                        headers: { Authorization: 'Bearer sk_test_affe46073a2b7bbb8619cceba17adc525e7be045' },
                    }, (err, res, result) => {
                        if (result && result.data) {
                            if (saveCard) {
                                user.update(
                                    { _id: options.userId },
                                    {
                                        $push: {
                                            cards: {
                                                cardNumber: result.data.authorization.last4,
                                                expMonth: result.data.authorization.exp_month,
                                                expYear: result.data.authorization.exp_year,
                                                authorizationCode: result.data.authorization.authorization_code,
                                                bank: result.data.authorization.bank,
                                                cardType: result.data.card_type,
                                            }
                                        }
                                    }
                                    , (err, updated) => {
                                        if (updated) {
                                            // resolve({ success: true, message: 'success', data: updated, })
                                            resolve({ success: true, message: 'Service booked successfully' })
                                        }
                                    })
                            } else {
                                resolve({ success: true, message: 'success', data: result.data, })
                            }
                        } else {
                            reject({ success: false, message: 'failed', data: result.message, })
                        }
                    });
            } else {
                resolve({ success: false, message: 'Could not complete your booking process' })
            }
        }).catch(err => {
            reject(err);
        })
    })
}

exports.getUserBookings = (pagenumber = 1, pagesize = 20, userId) => {
    return new Promise((resolve, reject) => {
        model.find({ userId: userId }).skip((parseInt(pagenumber - 1) * parseInt(pagesize))).limit(parseInt(pagesize))
            .populate({ path: "services.subServiceId", model: "subServices", select: { _id: 0, __v: 0 } })
            .populate({ path: "userId", model: "user", select: { _id: 0, __v: 0 } })
            .populate({ path: "stylerId", model: "stylers", select: { _id: 0, __v: 0 } })
            .exec((err, data) => {
                if (err) reject(err);
                if (data) {
                    resolve({ success: true, message: 'Bookings found', data: data })
                } else {
                    resolve({ success: false, message: 'Unable to find what you searched for !!' })
                }
            });
    })
}

exports.getStylerRequests = (pagenumber = 1, pagesize = 20, userId) => {
    return new Promise((resolve, reject) => {
        model.find({ stylerId: userId, accepted: false || null, completed: false || null, }).skip((parseInt(pagenumber - 1) * parseInt(pagesize))).limit(parseInt(pagesize))
            .populate({ path: "services.subServiceId", model: "subServices", select: { _id: 0, __v: 0 } })
            .populate({ path: "userId", model: "user", select: { _id: 0, __v: 0 } })
            .populate({ path: "stylerId", model: "stylers", select: { _id: 0, __v: 0 } })
            .exec((err, data) => {
                if (err) reject(err);
                if (data) {
                    resolve({ success: true, message: 'Appointments found', data: data })
                } else {
                    resolve({ success: false, message: 'Unable to find what you searched for !!' })
                }
            });
    })
}

exports.getStylerAppointments = (pagenumber = 1, pagesize = 20, userId) => {
    return new Promise((resolve, reject) => {
        model.find({ stylerId: userId, accepted: true, completed: false || null, }).skip((parseInt(pagenumber - 1) * parseInt(pagesize))).limit(parseInt(pagesize))
            .populate({ path: "services.subServiceId", model: "subServices", select: { _id: 0, __v: 0 } })
            .populate({ path: "userId", model: "user", select: { _id: 0, __v: 0 } })
            .populate({ path: "stylerId", model: "stylers", select: { _id: 0, __v: 0 } })
            .exec((err, data) => {
                if (err) reject(err);
                if (data) {
                    resolve({ success: true, message: 'Appointments found', data: data, })
                } else {
                    resolve({ success: false, message: 'Unable to find what you searched for !!' })
                }
            });
    })
}

exports.acceptAppointment = (appointmentId) => {
    return new Promise((resolve, reject) => {
        model.findByIdAndUpdate(appointmentId, { accepted: true, dateAccepted: Date.now() }).exec((err, data) => {
            if (err) reject(err);
            if (data) {
                resolve({ success: true, message: 'Appointments accepted' })
            } else {
                resolve({ success: false, message: 'Unable to accept appointment!!' })
            }
        });
    })
}

exports.completeAppointment = (appointmentId) => {
    return new Promise((resolve, reject) => {
        model.findByIdAndUpdate(appointmentId, { completed: true, dateCompleted: Date.now() }).exec((err, data) => {
            if (err) reject(err);
            if (data) {
                resolve({ success: true, message: 'Appointments completed' })
            } else {
                resolve({ success: false, message: 'Unable to complete appointment!!' })
            }
        });
    })
}

// ratings: [{
//     rating: { type: Number },
//     userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'user', autopopulate: true },
//     appointmentId: { type: String, ref: 'booking', autopopulate: true, },
//     CreatedAt: { type: Date, default: Date.now }
// }],
// review: [{
//     userId: { type: String, ref: 'user', autopopulate: true },
//     appointmentId: { type: String, ref: 'booking', autopopulate: true, },
//     message: { type: String },
//     CreatedAt: { type: Date, default: Date.now }
// }],

exports.addRating = (options, auth) => {
    return new Promise((resolve, reject) => {
    console.log(options)

        styler.update(
            { userId: options.stylerId },
            {
                $push: {
                    ratings: {
                        rating: options.rating,
                        userId: auth.Id,
                        appointmentId: options.appointmentId,
                    },
                    review: {
                        message: options.message,
                        userId: auth.Id,
                        appointmentId: options.appointmentId,
                    }
                }
            }
        ).exec((err, data) => {
            console.log(data)
            if (err) reject(err);
            if (data) {
                resolve({ success: true, message: 'Ratings added' })
            } else {
                resolve({ success: false, message: 'Unable to add ratings!!' })
            }
        });
    })
}