var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic')
var BookingSchema = new Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'user', autopopulate: true },
    stylerId: { type: mongoose.SchemaTypes.ObjectId, ref: 'stylers', autopopulate: true },
    serviceId: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'services', autopopulate: true }],
    scheduledDate: { type: Date, default: new Date() },
    numberOfAdults: { type: Number },
    numberOfChildren: { type: Number },
    location: { type: String, required: true },
    TotalAmount: { type: String },
    CreatedAt: { type: Date },


})
BookingSchema.plugin(mongoosastic)

module.exports = mongoose.model('booking', BookingSchema); 