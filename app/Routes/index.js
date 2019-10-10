var AuhtRoutes = require('./UserAuthRoutes');
var StylerAuhtRoutes = require('./StylersAuthRoute');
var ServicesRoutes = require('./ServicesRoutes')
module.exports = function(router){
    router.use('/auth',AuhtRoutes())
    router.use('/StylerAuth',StylerAuhtRoutes())
    router.use('/services' , ServicesRoutes())

 return router;
}