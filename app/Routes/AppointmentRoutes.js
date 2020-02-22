var BookingController = require('../Controller/AppointmentControllers');
var middleware = require('../Middleware/AuthMiddleware');
var router = require('express').Router();
module.exports = function () {
    const bookingCtrl = new BookingController();
    router.get('/search', bookingCtrl.SearchServices);
    router.post('/', middleware.authenticate, bookingCtrl.CreateBooking);
    router.get('/user/:pagesize/:pagenumber', middleware.authenticate, bookingCtrl.UserBookings);
    router.get('/styler/:pagesize/:pagenumber', middleware.StylerAuthenticate, bookingCtrl.StylerAppointments);
    router.get('/styler/requests/:pagesize/:pagenumber', middleware.StylerAuthenticate, bookingCtrl.StylerRequests);
    router.put('/appointment/accept', bookingCtrl.acceptAppointment);
    router.put('/appointment/complete', bookingCtrl.completeAppointment);
    router.put('/rating', middleware.authenticate, bookingCtrl.addRating);
    return router;
}