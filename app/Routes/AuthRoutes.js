var authController = require('../Controller/AuthController');

var router = require('express').Router();
module.exports = function(){
    const authCtrl = new authController();
    router.post('/register', authCtrl.register);
    router.post('/authenticate', authCtrl.authenticate);


    return router;
}