const mongoose = require('mongoose');
const { Schema } = mongoose;

const citySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String // URL to image
  }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);