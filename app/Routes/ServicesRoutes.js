var ServicesauthController = require('../Controller/ServicesController');
var middleware = require('../Middleware/AuthMiddleware');
var multer = require('../Middleware/multer')
var router = require('express').Router();
module.exports = function(){
    const servicesauthCtrl = new ServicesauthController();
    router.post('/', multer.upload.single('image') , servicesauthCtrl.CreateService)
    router.get('/search',servicesauthCtrl.SearchServices);
    router.get('/:pagesize/:pagenumber', servicesauthCtrl.GetAllServices)
    router.get('/:id', servicesauthCtrl.GetServiceById)
    router.delete('/:id', servicesauthCtrl.DeleteService)
    router.put('/:id', multer.upload.single('image') , servicesauthCtrl.UpdateService)
    
    return router;
}