var AuhtRoutes = require('./UserAuthRoutes');
var StylerAuhtRoutes = require('./StylersAuthRoute');
var ServicesRoutes = require('./ServicesRoutes');
var BookingRoutes = require('./BookingRoutes');
var ContactRoutes = require("./contactRoutes");
module.exports = function(router){
    router.use('/auth',AuhtRoutes())
    router.use('/StylerAuth',StylerAuhtRoutes())
    router.use('/services' , ServicesRoutes())
    router.use('/booking' , BookingRoutes())
    router.use('/help', ContactRoutes())
 return router;
}