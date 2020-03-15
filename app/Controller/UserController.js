var userService = require("../Service/UserService");
var cloudinary = require("../Middleware/cloudinary");
var mongoose = require("mongoose");
var rand = require("random-number");

module.exports = function authController() {
  this.register = (req, res, next) => {
    var gen = Math.floor(1000 + Math.random() * 9000);
    var Options = {
      name: req.body.name,
      publicId: mongoose.Types.ObjectId(),
      statusCode: gen,
      gender: req.body.gender,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      type: req.body.type
    };
    console.log(Options , 'wellcome---')
    userService
      .RegisterUser(Options)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.json(err);
      });
  };

  this.authenticate = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    userService
      .authenticateuser(email, password)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send(err));
  };

  this.passwordToken = function(req, res, next) {
    var gen = Math.floor(1000 + Math.random() * 9000);
    var data = {
      email: req.body.email,
      passwordToken: gen
    };
    userService
      .forgotPasswordToken(data)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send(err));
  };

  this.changeforgotPassword = function(req, res, next) {
    var data = {
      passwordToken: req.body.passwordToken,
      password: req.body.password
    };
    userService
      .changeforgotPassword(data)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send(err));
  };

  this.changePassword = function(req, res, next) {
    var data = {
      originalPassword: req.body.originalPassword,
      password: req.body.password,
      email:req.auth.email
    };
    userService
      .changepassword(data)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send(err));
  };


  this.VerifyUser = function(req, res) {
    var email = req.body.email;
    var Token = req.body.token;
    userService
      .verifyAccount(email, Token)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send(err));
  };

  this.VerifySocial = function(req, res) {
    var email = req.body.email;
    userService
      .verifySocial(email)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send(err));
  };

  this.VerifyToken = function(req, res) {
    var email = req.body.email;
    var Token = req.body.token;
    userService
      .verifyToken(Token)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send(err));
  };

  this.updateClientProfile = async (req, res) => {
    console.log("checking file", req.file != null && req.file !== undefined);
    var requestDetails = {
      image: req.file != null && req.file !== undefined ? req.file.path : null
    };

    console.log("file detail recieved", requestDetails.image);
    if (req.image !== null && req.file !== undefined) {
      await cloudinary.uploadToCloud(requestDetails.image).then(img => {
        console.log("Cloudinary details recieved", img.url);
        requestDetails.imageUrl = img.url;
        requestDetails.imageID = img.ID;
        return requestDetails;
      });
    }

    console.log("calling outside await");
    userService
      .updateProfile(req.auth.publicId, requestDetails)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };

  this.getUserData = async (req, res) => {
    userService
      .getUserData(req.params.id)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };

  this.fetchCards = async (req, res) => {
    userService
      .fetchCards(req.auth.Id)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };
};
