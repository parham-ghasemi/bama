const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  villa: {
    type: Schema.Types.ObjectId,
    ref: 'Villa',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: [{
    type: String // Array of image URLs
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  date: {
    type: String // Format: yyyy/mm/dd
  },
  hasBooked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);