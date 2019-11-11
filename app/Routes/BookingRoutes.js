var BookingController = require('../Controller/BookingControllers');
var middleware = require('../Middleware/AuthMiddleware');
var router = require('express').Router();
module.exports = function(){
    const bookingCtrl = new BookingController();
    router.get('/search',bookingCtrl.SearchServices);
    router.post('/', middleware.authenticate , bookingCtrl.CreateBooking);
    router.get('/user/:pagesize/:pagenumber', middleware.authenticate , bookingCtrl.UserBookings);
    router.get('/styler/:pagesize/:pagenumber', middleware.StylerAuthenticate , bookingCtrl.StylerAppointments);
    return router;
}