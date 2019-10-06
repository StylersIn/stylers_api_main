var AuhtRoutes = require('./AuthRoutes');

module.exports = function(router){
    router.use('/auth',AuhtRoutes())


 return router;
}