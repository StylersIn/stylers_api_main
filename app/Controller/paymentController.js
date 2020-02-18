var service = require('../Service/paymentService');
module.exports = function paymentController() {

    this.create = (req, res) => {
        service.CreatePayment(Object.assign(req.body, { userId: req.auth.Id })).then(data => {
            res.json({ data });
        }).catch(err => {
            res.status(500).send(err);
        })
    }

    this.initTransaction = (req, res) => {
        service.InitializeTransaction(req.body)
            .then(data => res.status(200).send(data))
            .catch(err => res.status(500).send(err));
    }
}