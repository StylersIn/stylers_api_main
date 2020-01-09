var BookingService = require('../Service/BookingService');
module.exports = function ServicesController() {

    this.SearchServices = (req, res) => {
        console.log('kkkk')
        var option = req.query.service;
        console.log(option)
        BookingService.FindStyler(option).then((data) => {
            res.json({ data });
        }).catch((err) => {
            res.status(500).send(err);
        });
    }

    this.CreateBooking = (req, res) => {
        //    var Options = {
        //     userId:req.auth.Id,
        //     stylerId:req.body.styler,
        //     // serviceId:req.body.service,
        //     scheduledDate:Date.now(),
        //     // numberOfAduls:req.body.adult,
        //     // numberOfChildren:req.body.child,
        //     location:req.body.locations,
        //    }
        BookingService.BookService(Object.assign(req.body, { userId: req.auth.Id })).then((data) => {
            res.json({ data });
        }).catch((err) => {
            res.status(500).send(err);
        });
    }


    this.UserBookings = function (req, res, next) {
        BookingService.getUserBookings(req.params.pagenumber, req.params.pagesize, req.auth.Id)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.StylerRequests = function (req, res, next) {
        BookingService.getStylerRequests(req.params.pagenumber, req.params.pagesize, req.auth.Id)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.StylerAppointments = function (req, res, next) {
        BookingService.getStylerAppointments(req.params.pagenumber, req.params.pagesize, req.auth.Id)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.acceptAppointment = function (req, res, next) {
        BookingService.acceptAppointment(req.body.appointmentId)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.completeAppointment = function (req, res, next) {
        BookingService.completeAppointment(req.body.appointmentId)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }
}