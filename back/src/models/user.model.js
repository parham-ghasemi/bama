const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  pfp: {
    type: String,
    default: ''
  },
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  birthdate: {
    type: String, // Format: yyyy/mm/dd (e.g., "1388/04/11")
    required: true
  },
  phoneNumber: {
    type: String, // Iranian phone number (e.g., "09912525964")
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  homeNumber: {
    type: String // Iranian home number
  },
  bio: {
    type: String,
    default: ''
  },
  LikedVillas: [{
    type: Schema.Types.ObjectId,
    ref: 'Villa'
  }],
  history: [{
    type: Schema.Types.ObjectId,
    ref: 'Reservation'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);