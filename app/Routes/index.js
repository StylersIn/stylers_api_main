var AuhtRoutes = require('./UserAuthRoutes');
var StylerAuhtRoutes = require('./StylersAuthRoute');

module.exports = function(router){
    router.use('/auth',AuhtRoutes())
    router.use('/StylerAuth',StylerAuhtRoutes())


 return router;
}