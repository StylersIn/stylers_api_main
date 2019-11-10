var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic')
var BookingSchema = new Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'user', autopopulate: true },
    stylerId: { type: mongoose.SchemaTypes.ObjectId, ref: 'stylers', autopopulate: true },
    services: [{
        serviceId: { type: String, ref: 'services', autopopulate: true },
        adult: { type: Number },
        child: { type: Number }
    }],
    // serviceId: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'services', autopopulate: true }],
    scheduledDate: { type: Date, default: new Date() },
    // numberOfAdults: { type: Number },
    // numberOfChildren: { type: Number },
    location: { type: String, required: true },
    totalAmount: { type: String },
    CreatedAt: { type: Date, default: Date.now },


})
BookingSchema.plugin(mongoosastic)

module.exports = mongoose.model('booking', BookingSchema); 