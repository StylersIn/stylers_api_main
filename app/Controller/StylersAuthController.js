var StylersService = require('../Service/StylersauthService');
var cloudinary = require('../Middleware/cloudinary')
var mongoose = require('mongoose');
module.exports = function authController() {
    this.register = (req, res, next) => {
        var Options = {
            fullName: req.body.fullName,
            publicId: mongoose.Types.ObjectId(),
            gender: req.body.gender,
            address: req.body.address,
            description: req.body.description,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
        }
        StylersService.RegisterUser(Options).then((data) => {
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

    this.AddServices = function (req, res, next) {
        var data = { adult: req.body.adults, child: req.body.kids, serviceId: req.body.service }
        StylersService.AddServicePrice(req.params.id, data)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.GetStylers = function (req, res, next) {

        StylersService.getStylers({})
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.UpdateServices = function (req, res, next) {
        var data = { amount: req.body.price, serviceId: req.body.service }
        StylersService.UpdateServicePrice(req.params.id, data)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.updateClientProfile = async (req, res) => {
        console.log("checking file", (req.file != null && req.file !== undefined));
        var requestDetails = {

            image: (req.file != null && req.file !== undefined) ? req.file.path : null
        };

        console.log("file detail recieved", requestDetails.image);
        if (req.image !== null && req.file !== undefined) {
            await cloudinary.uploadToCloud(requestDetails.image).then((img) => {
                console.log("Cloudinary details recieved", img.url);
                requestDetails.imageUrl = img.url;
                requestDetails.imageID = img.ID;
                return requestDetails;
            });
        }

        console.log("calling outside await")
        StylersService.updateProfile(req.auth.publicId, requestDetails)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };

}

