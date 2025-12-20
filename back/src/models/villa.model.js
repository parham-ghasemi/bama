const mongoose = require('mongoose');
const { Schema } = mongoose;

const villaSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  address: {
    type: String,
    required: true
  },
  extraInformation: {
    type: String,
    default: ''
  },
  rules: {
    type: Schema.Types.Mixed // Object with rule strings as keys and boolean values
  },
  items: [{
    type: String // Array of item strings (e.g., "tv", "garage")
  }],
  images: [{
    type: String // Array of image URLs
  }],
  price: {
    type: Number,
    required: true
  },
  maxAdults: {
    type: Number,
    required: true,
    min: 1 // Cannot be 0
  },
  maxChildren: {
    type: Number,
    default: 0
  },
  reserved: [{
    type: Schema.Types.ObjectId,
    ref: 'Reservation' // Array of future reservation IDs
  }],
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  numberOfRooms: {
    type: Number,
    default: 0
  },
  numberOfDoubleBeds: {
    type: Number,
    default: 0
  },
  numberOfBeds: {
    type: Number,
    default: 0
  },
  numberOfBathrooms: {
    type: Number,
    default: 0
  },
  numberOfIranianToilets: {
    type: Number,
    default: 0
  },
  numberOfFarangiToilets: {
    type: Number,
    default: 0
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  deletionDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Villa', villaSchema);