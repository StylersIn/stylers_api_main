var AuhtRoutes = require('./UserAuthRoutes');
var StylerAuhtRoutes = require('./StylersAuthRoute');
var ServicesRoutes = require('./ServicesRoutes');
var AppointmentRoutes = require('./AppointmentRoutes');
var PaymentRoutes = require('./paymentRoutes')
var ContactRoutes = require("./contactRoutes");
module.exports = function(router){
    router.use('/auth',AuhtRoutes())
    router.use('/StylerAuth',StylerAuhtRoutes())
    router.use('/services' , ServicesRoutes())
    router.use('/appointment' , AppointmentRoutes())
    router.use('/pay', PaymentRoutes())
    router.use('/help', ContactRoutes())
 return router;
}