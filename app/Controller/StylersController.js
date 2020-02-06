var StylersService = require('../Service/StylersService');
var cloudinary = require('../Middleware/cloudinary')
var mongoose = require('mongoose');

module.exports = function authController() {
    this.register = (req, res, next) => {
        // var Options = {
        //     name: req.body.name,
        //     publicId: mongoose.Types.ObjectId(),
        //     address: req.body.address,
        //     description: req.body.description,
        //     email: req.body.email,
        //     phoneNumber: req.body.phoneNumber,
        //     password: req.body.password,
        // }
        StylersService.RegisterUser(Object.assign(req.body, { publicId: mongoose.Types.ObjectId() })).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json(err);
        })
    }

    this.authenticate = function (req, res, next) {
        var username = req.body.username
        var password = req.body.password
        StylersService.authenticateuser(username, password)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.stylerRegStatus = function (req, res, next) {
        StylersService.StylerRegStatus(req.auth.Id)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    // this.AddServices = function (req, res, next) {
    //     var data = { adult: req.body.adults, child: req.body.kids, serviceId: req.body.service }
    //     StylersService.AddServicePrice(req.params.id, data)
    //         .then(data => res.status(200).send(data))
    //         .catch(err => res.status(500).send(err));
    // }

    this.GetStylers = function (req, res, next) {
        StylersService.getStylers({})
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.SortStylers = function (req, res, next) {
        StylersService.sortStylers({})
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.SortStylersByPrice = function (req, res, next) {
        StylersService.sortStylersByPrice(req.params.id)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.SortStylersByRating = function (req, res, next) {
        StylersService.sortStylersByRating(req.params.id)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }



    this.GetStyler = function (req, res, next) {
        StylersService.getStylerById(req.params.id)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.UpdateServices = function (req, res, next) {
        // var data = { amount: req.body.price, serviceId: req.body.service }
        StylersService.UpdateServicePrice(req.auth.Id, req.body.services)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.updateClientProfile = async (req, res) => {
        var requestDetails = {};

        if (req.body.image) {
            requestDetails.imageUrl = req.body.image.secure_url;
            requestDetails.imageID = req.body.image.public_id;
        }

        console.log("calling outside await", requestDetails)
        StylersService.updateProfile(req.auth.publicId, requestDetails)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };

    this.GetStylersByServices = function (req, res, next) {
        StylersService.GetStylerByService(req.params.service, req.params.pagenumber, req.params.pagesize)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }


    this.favouriteStylerService = function (req, res, next) {
        StylersService.FavouriteStyler(req.auth.publicId, req.params.id, req.body.service)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.StylerReview = function (req, res, next) {
        var data = { userId: req.auth.Id, message: req.body.review, CreatedAt: Date.now() }
        StylersService.reviewStyler(req.params.id, data)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.getStylerTotalAmount = (req, res) => {
        StylersService.getStylerTotalAmount(req.auth.Id).then(data => {
            res.json({ data });
        }).catch(err => {
            res.status(500).send(err);
        })
    }

    this.updateStylerLocation = (req, res) => {
        StylersService.updateStylerLocation(req.body.location, req.auth.Id)
            .then(data => res.json(data))
            .catch(err => res.status(500).send(err));
    }

    this.GetStylersServices = (req, res) => {
        StylersService.GetStylersServices(req.auth.Id)
            .then(data => res.json(data))
            .catch(err => res.status(500).send(err));
    }
}

