var UserRoutes = require('./UserRoutes');
var StylerRoutes = require('./StylersRoute');
var ServicesRoutes = require('./ServicesRoutes');
var AppointmentRoutes = require('./AppointmentRoutes');
var PaymentRoutes = require('./paymentRoutes')
var ContactRoutes = require("./contactRoutes");
module.exports = function (router) {
    router.use('/user', UserRoutes())
    router.use('/styler', StylerRoutes())
    router.use('/services', ServicesRoutes())
    router.use('/appointment', AppointmentRoutes())
    router.use('/payment', PaymentRoutes())
    router.use('/help', ContactRoutes())
    return router;
}