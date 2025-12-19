const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  pfp: {
    type: String,
    default: ''
  },
  name: {
    first: {
      type: String
    },
    last: {
      type: String
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  birthdate: {
    type: String // Format: yyyy/mm/dd (e.g., "1388/04/11")
  },
  phoneNumber: {
    type: String, // Iranian phone number (e.g., "09912525964")
    required: true,
    unique: true
  },
  email: {
    type: String,
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
  }],
  submittedVillas: [{
    type: Schema.Types.ObjectId,
    ref: 'Villa'
  }],
  lastLogin: {
    type: Date
  },
  otp: {
    type: String
  },
  otpExpiration: {
    type: Date
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);