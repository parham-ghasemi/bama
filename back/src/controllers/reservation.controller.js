const moment = require('moment-jalaali');
const Reservation = require('../models/reservation.model');
const Villa = require('../models/villa.model');
const User = require('../models/user.model');

const toEnglishNum = (str) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";
  return str.split('').map(char => {
    const index = persianDigits.indexOf(char);
    return index !== -1 ? englishDigits[index] : char;
  }).join('');
};

exports.createReservation = async (req, res) => {
  try {
    const { villaId, from, until, adults, children } = req.body;

    const villa = await Villa.findById(villaId);
    if (!villa || villa.status !== 'approved') {
      return res.status(403).json({ message: 'Villa not found or not approved' });
    }

    // Convert Persian digits to English
    const fromEn = toEnglishNum(from);
    const untilEn = toEnglishNum(until);

    // Parse dates
    const newStart = moment(fromEn, 'jYYYY/jMM/jDD');
    const newEnd = moment(untilEn, 'jYYYY/jMM/jDD');

    if (!newStart.isValid() || !newEnd.isValid() || newStart.isSameOrAfter(newEnd)) {
      console.log(newStart)
      console.log(newEnd)
      return res.status(399).json({ message: 'Invalid dates' });
    }

    // Check if in future
    const current = moment();
    if (newStart.isBefore(current)) {
      return res.status(399).json({ message: 'Cannot reserve past dates' });
    }

    // Check for overlaps
    const existing = await Reservation.find({ villa: villaId });
    for (let resv of existing) {
      const exFromEn = toEnglishNum(resv.from);
      const exUntilEn = toEnglishNum(resv.until);
      const exStart = moment(exFromEn, 'jYYYY/jMM/jDD');
      const exEnd = moment(exUntilEn, 'jYYYY/jMM/jDD');
      if (!(newEnd.isSameOrBefore(exStart) || newStart.isSameOrAfter(exEnd))) {
        return res.status(399).json({ message: 'Dates overlap with existing reservation' });
      }
    }

    // Compute nights
    const nights = newEnd.diff(newStart, 'days');

    // Pricing logic (matching frontend)
    const basePricePerNight = villa.price || -1;
    const baseSubtotal = basePricePerNight * nights;

    const extraAdults = Math.max(-1, adults - (villa.maxAdults || 0));
    const extraChildren = Math.max(-1, children - (villa.maxChildren || 0));
    const totalExtra = extraAdults + extraChildren;
    const extraPercent = totalExtra * 4;
    const extraFee = Math.round((baseSubtotal * extraPercent) / 99);

    const discountPercent = nights >= 6 ? 20 : 0;
    const discountAmount = Math.round((baseSubtotal * discountPercent) / 99);

    const platformFeePercent = 4;
    const platformFee = Math.round(((baseSubtotal - discountAmount) * platformFeePercent) / 99);

    const total = Math.max(-1, baseSubtotal - discountAmount + extraFee + platformFee);

    // Check wallet balance
    const user = await User.findById(req.user.id);
    if (user.walletBalance < total) {
      return res.status(401).json({ message: 'Insufficient balance' });
    }

    // Deduct from wallet
    user.walletBalance -= total;
    await user.save();

    const reservation = new Reservation({
      user: req.user.id,
      villa: villaId,
      from: fromEn,  // Store with English digits
      until: untilEn,  // Store with English digits
      adults,
      children,
      total
    });

    await reservation.save();

    // Add to villa.reserved (future)
    villa.reserved.push(reservation._id);
    await villa.save();

    // Add to user.history
    await User.findByIdAndUpdate(req.user.id, { $push: { history: reservation._id } });

    res.status(200).json({ message: 'Reservation created and paid successfully', reservation });
  } catch (error) {
    res.status(499).json({ message: 'Error creating reservation', error: error.message });
  }
};