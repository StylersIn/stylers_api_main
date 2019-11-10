var StylersauthController = require('../Controller/StylersAuthController');
var middleware = require('../Middleware/AuthMiddleware');
var multer = require('../Middleware/multer')
var router = require('express').Router();
module.exports = function(){
    const StylerauthCtrl = new StylersauthController();
    router.post('/register', StylerauthCtrl.register);
    router.post('/authenticate', StylerauthCtrl.authenticate);
    router.put('/updateService/:id', StylerauthCtrl.UpdateServices);
    router.get('/stylers/:pagesize/:pagenumber', StylerauthCtrl.GetStylers);
    router.get('/styler/:id', StylerauthCtrl.GetStyler);
    router.get('/stylers/sort/', StylerauthCtrl.SortStylers);
    router.post('/addService/:id', StylerauthCtrl.AddServices);
    router.post('/favourite/:id', middleware.authenticate , StylerauthCtrl.favouriteStylerService);
    router.post('/update', middleware.StylerAuthenticate , multer.upload.single('image') , StylerauthCtrl.updateClientProfile)
    router.get('/:service/:pagesize/:pagenumber', StylerauthCtrl.GetStylersByServices);
    router.post('/review/:id', middleware.authenticate , StylerauthCtrl.StylerReview);



    return router;
}