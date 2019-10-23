var ServicesService = require('../Service/servicesService');
var cloudinary = require('../Middleware/cloudinary')
var mongoose = require('mongoose');
module.exports = function ServicesController() {

    this.CreateService = async (req, res) => {
        console.log("checking file", (req.file != null && req.file !== undefined));
        // var requestDetails = {
        //     name: req.body.name,
        //     image: (req.file != null && req.file !== undefined) ? req.file.path : null,
        //     CreatedAt: new Date()
        // };

        // console.log("file detail recieved", requestDetails.image);
        // if (req.image !== null && req.file !== undefined) {
        //     await cloudinary.uploadToCloud(requestDetails.image).then((img) => {
        //         console.log("Cloudinary details recieved", img.url);
        //         requestDetails.imageUrl = img.url;
        //         requestDetails.imageID = img.ID;
        //         return requestDetails;
        //     });
        // }

        // console.log("calling outside await")
        // ServicesService.CreateService(requestDetails)
        //     .then(data => {
        //         res.status(200).send(data);
        //     })
        //     .catch(err => {
        //         res.status(500).send(err);
        //     });
    };

    this.GetAllServices = function (req, res) {
        ServicesService.GetAllServices(req.params.pagenumber, req.params.pagesize)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.GetServiceById = function (req, res) {
        ServicesService.GetServiceById(req.params.id)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }


    this.DeleteService = function (req, res) {
        ServicesService.DeleteService(req.params.id)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }

    this.UpdateService = async (req, res) => {
        console.log("checking file", (req.file != null && req.file !== undefined));
        var requestDetails = {
            name: req.body.name,
            image: (req.file != null && req.file !== undefined) ? req.file.path : null,
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
        ServicesService.UpdateService(req.params.id, requestDetails)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };

    this.SearchServices = (req, res) => {
        console.log('kkkk')
        var option = req.query.service;
        console.log(option)
        ServicesService.SearchService(option).then((data) => {
            res.json({ data });
        }).catch((err) => {
            res.status(500).send(err);
        });
    }


}