var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stylersSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'user', autopopulate: true },
    publicId: { type: mongoose.Types.ObjectId },
    address: { type: String, required: true },
    description: { type: String, required: true },
    IsVerified: { type: Boolean },
    services: [{
        serviceId: { type: String, ref: 'services', autopopulate: true },
        adult: { type: Number },
        child: { type: Number }
    }],
    ratings: [{
        rating: { type: Number },
        userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'user', autopopulate: true },
    }],
    favorites: [{
        type: mongoose.SchemaTypes.ObjectId, ref: 'user', autopopulate: true,
    }],
    CreatedAt: { type: Date },
})

module.exports = mongoose.model('stylers', stylersSchema);
