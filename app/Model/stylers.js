var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stylersSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'user', autopopulate: true },
    publicId: { type: mongoose.Types.ObjectId },
    address: { type: String },
    description: { type: String },
    startingPrice: { type: Number },
    IsVerified: { type: Boolean  , default:false},
    passwordToken:{type:Number },
    role: { type: String , default:'' },
    services: [{
        // favorites: [{ type: String, ref: 'user', autopopulate: true }],
        serviceId: { type: String, ref: 'services', autopopulate: true },
        subServiceId: { type: String, ref: 'subServices', autopopulate: true },
        adult: { type: Number },
        child: { type: Number }
    }],
    ratings: [{
        rating: { type: Number },
        userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'user', autopopulate: true },
        appointmentId: { type: String, ref: 'booking', autopopulate: true, },
        CreatedAt: { type: Date, default: Date.now }
    }],
    review: [{
        userId: { type: String, ref: 'user', autopopulate: true },
        appointmentId: { type: String, ref: 'booking', autopopulate: true, },
        message: { type: String },
        CreatedAt: { type: Date, default: Date.now }
    }],
    favorites: [{
        type: mongoose.SchemaTypes.ObjectId, ref: 'user', autopopulate: true,
    }],
    CreatedAt: { type: Date },
})

module.exports = mongoose.model('stylers', stylersSchema);
