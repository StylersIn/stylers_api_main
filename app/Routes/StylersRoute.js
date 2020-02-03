var StylersauthController = require('../Controller/StylersController');
var middleware = require('../Middleware/AuthMiddleware');
var multer = require('../Middleware/multer')
var router = require('express').Router();
var _base64ToFile = require('../Service/UtilityService').base64ToFile;
var _cloudinaryHelper = require('../Service/UtilityService').cloudinaryHelper;
var _config = require('../config');

module.exports = function () {
    const StylerauthCtrl = new StylersauthController();
    router.post('/register', StylerauthCtrl.register);
    router.get('/register/status', middleware.authenticate, StylerauthCtrl.stylerRegStatus);
    router.post('/authenticate', StylerauthCtrl.authenticate);
    // router.put('/updateService/:id', StylerauthCtrl.UpdateServices);
    router.get('/stylers/sort/price/:id', StylerauthCtrl.SortStylersByPrice);
    router.get('/stylers/sort/rating/:id', StylerauthCtrl.SortStylersByRating);
    router.get('/stylers/:pagesize/:pagenumber', StylerauthCtrl.GetStylers);
    router.get('/styler/:id', StylerauthCtrl.GetStyler);
    // router.post('/addService/:id', StylerauthCtrl.AddServices);
    router.get('/stylers/sort/', StylerauthCtrl.SortStylers);
    router.post('/favourite/:id', middleware.authenticate, StylerauthCtrl.favouriteStylerService);
    router.put('/update/avatar', middleware.authenticate, _base64ToFile("image", _cloudinaryHelper({}, _config.cloudinary)), StylerauthCtrl.updateClientProfile)
    router.put('/update/services', middleware.authenticate, StylerauthCtrl.UpdateServices)
    router.get('/:service/:pagesize/:pagenumber', StylerauthCtrl.GetStylersByServices);
    router.get('/services', middleware.authenticate, StylerauthCtrl.GetStylersServices);
    router.post('/review/:id', middleware.authenticate, StylerauthCtrl.StylerReview);
    router.get('/stats', middleware.StylerAuthenticate , StylerauthCtrl.getStylerTotalAmount);

    return router;
}