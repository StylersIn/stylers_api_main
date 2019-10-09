var StylersauthController = require('../Controller/StylersAuthController');
var middleware = require('../Middleware/AuthMiddleware');
var multer = require('../Middleware/multer')
var router = require('express').Router();
module.exports = function(){
    const StylerauthCtrl = new StylersauthController();
    router.post('/register', StylerauthCtrl.register);
    router.post('/authenticate', StylerauthCtrl.authenticate);
    router.post('/update', middleware.StylerAuthenticate , multer.upload.single('image') , StylerauthCtrl.updateClientProfile)


    return router;
}