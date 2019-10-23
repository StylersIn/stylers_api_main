var authController = require('../Controller/UserAuthController');
var middleware = require('../Middleware/AuthMiddleware');
var multer = require('../Middleware/multer')
var router = require('express').Router();
module.exports = function(){
    const authCtrl = new authController();
    router.post('/register', authCtrl.register);
    router.post('/authenticate', authCtrl.authenticate);
    router.post('/verify', authCtrl.VerifyUser);
    router.put('/update', middleware.authenticate , multer.upload.single('image') , authCtrl.updateClientProfile)


    return router;
}