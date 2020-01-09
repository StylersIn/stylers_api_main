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
    pickUp: {
        latitude: String,
        longitude: String,
        // streetName: String,
    },
    accepted: Boolean,
    completed: Boolean,
    seen: Boolean,
    dateSeen: { type: Date },
    streetName: { type: String },
    totalAmount: { type: Number },
    scheduledDate: { type: Date, default: new Date() },
    startServiceDate: { type: Date, default: new Date() },
    endServiceDate: { type: Date, default: new Date() },
    dateAccepted: { type: Date },
    dateCompleted: { type: Date },
    CreatedAt: { type: Date, default: Date.now },
})

BookingSchema.plugin(mongoosastic)

module.exports = mongoose.model('booking', BookingSchema); 