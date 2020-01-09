var paymentController = require('../Controller/paymentController');
var middleware = require('../Middleware/AuthMiddleware');
var router = require('express').Router();
module.exports = function(){
    const payCtrl = new paymentController();
    router.post('/', middleware.authenticate , payCtrl.create);
    
    return router;
}