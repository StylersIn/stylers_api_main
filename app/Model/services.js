var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var servicesSchema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    imageID: { type: String, default: '' },
    CreatedAt: { type: Date },
})

servicesSchema.index({ '$**': 'text', "name": 'text' });
servicesSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('services', servicesSchema);