var model = require('../Model/contactUs');
var user = require('../Model/user');
var mailer = require('../Middleware/mailer');
exports.createHelp = (data) => {
    return new Promise((resolve, reject) => {
        user.findById({ _id: data.userId }).then(found => {
            if (found) {
                mailer.Help(data.email, data.name, data.message, (err, data) => {
                    if (err) resolve({ success: false, message: err });
                    if (data) {
                        resolve({ success: true, message: 'Your help message was sent' })
                    } else {
                        resolve({ success: false, message: 'Your help message was not sent' })
                    }
                })
            }
        }).catch(err => {
            resolve({ success: false, message: err });
        });
    })
}