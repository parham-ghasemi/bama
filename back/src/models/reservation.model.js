// Updated reservation model (backend: models/reservation.model.js)
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reservationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  villa: {
    type: Schema.Types.ObjectId,
    ref: 'Villa',
    required: true
  },
  from: {
    type: String, // Format: yyyy/mm/dd
    required: true
  },
  until: {
    type: String, // Format: yyyy/mm/dd
    required: true
  },
  adults: {
    type: Number,
    required: true
  },
  children: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);