var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic')
var BookingSchema = new Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'user', autopopulate: true },
    stylerId: { type: mongoose.SchemaTypes.ObjectId, ref: 'stylers', autopopulate: true },
    services: [{
        subServiceId: { type: String, ref: 'subServices', autopopulate: true },
        adult: { type: Number },
        child: { type: Number }
    }],
    pickUp: {
        latitude: String,
        longitude: String,
        // streetName: String,
    },
    stylerLocation: {
        latitude: String,
        longitude: String,
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
    transactionReference: { type: String, },
    // review: [{
    //     userId: { type: String, ref: 'user', autopopulate: true },
    //     message: { type: String },
    //     CreatedAt: { type: Date }
    // }],
    // ratings: [{
    //     rating: { type: Number },
    //     userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'user', autopopulate: true },
    // }],
})

BookingSchema.plugin(mongoosastic)

module.exports = mongoose.model('booking', BookingSchema); 