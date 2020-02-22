var model = require('../Model/payment');
var user = require('../Model/user');
const axios = require('axios');
const request = require('request');

exports.CreatePayment = (options) => {
    return new Promise((resolve, reject) => {
        model.create(options).then(created => {
            if (created) {
                resolve({ success: true, message: 'Payment was made successfully !!!' })
            } else {
                resolve({ success: false, message: 'Sorry payment was not made !!' })
            }
        }).catch(err => {
            reject(err);
        })
    })
}

exports.InitializeTransaction = (options, auth) => {
    return new Promise((resolve, reject) => {
        var formData = {
            reference: new Date().getTime(),
            amount: options.amount,
            email: auth.email
        }
        request('https://api.paystack.co/transaction/initialize',
            {
                method: 'POST',
                formData: formData,
                json: true,
                headers: { Authorization: 'Bearer sk_test_affe46073a2b7bbb8619cceba17adc525e7be045' },
            }, (err, res, response) => {
                if (response.data) {
                    resolve({ success: true, message: 'success', data: response.data, })
                } else {
                    reject({ success: false, message: response.message })
                }
            });
    })
}

exports.VerifyTransaction = (options, Id) => {
    return new Promise((resolve, reject) => {
        request(`https://api.paystack.co/transaction/verify/${options.transactionReference}`,
            {
                method: 'GET',
                json: true,
                headers: { Authorization: 'Bearer sk_test_affe46073a2b7bbb8619cceba17adc525e7be045' },
            }, (err, res, result) => {
                if (result && result.data) {
                    if (options.saveCard) {
                        user.update(
                            { _id: Id },
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
                                    resolve({ success: true, message: 'success', data: updated, })
                                }
                            })
                    } else {
                        resolve({ success: true, message: 'success', data: result.data, })
                    }
                } else {
                    reject({ success: false, message: 'failed', data: result.message, })
                }
            });
        // resolve({ success: true, message: 'success', data: cards, })
    })
}

exports.ChargeAuthorization = (options, auth) => {
    return new Promise((resolve, reject) => {
        console.log(options)
        var formData = {
            authorization_code: options.authorizationCode,
            amount: options.amount,
            email: auth.email
        }
        request('https://api.paystack.co/transaction/charge_authorization',
            {
                method: 'POST',
                formData: formData,
                json: true,
                headers: { Authorization: 'Bearer sk_test_affe46073a2b7bbb8619cceba17adc525e7be045' },
            }, (err, res, response) => {
                if (response.data) {
                    resolve({ success: true, message: 'success', data: response.data, })
                } else {
                    reject({ success: false, message: response.message })
                }
            });
    })
}