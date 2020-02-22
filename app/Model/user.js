var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    publicId: { type: mongoose.Types.ObjectId },
    statusCode: { type: Number },
    gender: { type: String },
    cards: [{
        cardNumber: String,
        expMonth: String,
        expYear: String,
        authorizationCode: String,
        bank: String,
        cardType: String,
    }],
    password: { type: String, required: true },
    status: { type: Boolean },
    imageUrl: { type: String, default: '' },
    imageID: { type: String, default: '' },
    CreatedAt: { type: Date },
    role: { type: String, required: true, default: 'user' },
    type: { type: String, default: 'default' },
    pushToken: { type: String, },
    userId: { type: String, },
})

module.exports = mongoose.model('user', userSchema);