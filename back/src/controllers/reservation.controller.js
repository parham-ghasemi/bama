const moment = require('moment-jalaali');
const Reservation = require('../models/reservation.model');
const Villa = require('../models/villa.model');
const User = require('../models/user.model');

exports.createReservation = async (req, res) => {
  try {
    const { villaId, from, until } = req.body;

    const villa = await Villa.findById(villaId);
    if (!villa || villa.status !== 'approved') {
      return res.status(404).json({ message: 'Villa not found or not approved' });
    }

    // Parse dates
    const newStart = moment(from, 'jYYYY/jMM/jDD');
    const newEnd = moment(until, 'jYYYY/jMM/jDD');

    if (!newStart.isValid() || !newEnd.isValid() || newStart.isSameOrAfter(newEnd)) {
      return res.status(400).json({ message: 'Invalid dates' });
    }

    // Check if in future
    const current = moment();
    if (newStart.isBefore(current)) {
      return res.status(400).json({ message: 'Cannot reserve past dates' });
    }

    // Check for overlaps
    const existing = await Reservation.find({ villa: villaId });
    for (let resv of existing) {
      const exStart = moment(resv.from, 'jYYYY/jMM/jDD');
      const exEnd = moment(resv.until, 'jYYYY/jMM/jDD');
      if (!(newEnd.isSameOrBefore(exStart) || newStart.isSameOrAfter(exEnd))) {
        return res.status(400).json({ message: 'Dates overlap with existing reservation' });
      }
    }

    const reservation = new Reservation({
      user: req.user.id,
      villa: villaId,
      from,
      until
    });

    await reservation.save();

    // Add to villa.reserved (future)
    villa.reserved.push(reservation._id);
    await villa.save();

    // Add to user.history
    await User.findByIdAndUpdate(req.user.id, { $push: { history: reservation._id } });

    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation', error: error.message });
  }
};