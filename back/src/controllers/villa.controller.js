const Villa = require('../models/villa.model');
const User = require('../models/user.model');

// Create a new villa (user uploads, sets to pending)
exports.createVilla = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if profile is fully filled out
    if (!user.name.first || !user.name.last || !user.gender || !user.birthdate || !user.email || !user.homeNumber) {
      return res.status(400).json({ message: 'Please complete your profile before submitting a villa.' });
    }

    const {
      name, address, extraInformation, rules, items, images, price,
      maxAdults, maxChildren, city, numberOfRooms, numberOfDoubleBeds,
      numberOfBeds, numberOfBathrooms, numberOfIranianToilets, numberOfFarangiToilets
    } = req.body;

    const villa = new Villa({
      name,
      address,
      extraInformation,
      rules, // Assuming rules is an object like { "no-smoking": true, "pets-allowed": false }
      items, // Array of strings
      images, // Array of URLs
      price,
      maxAdults,
      maxChildren,
      city,
      numberOfRooms,
      numberOfDoubleBeds,
      numberOfBeds,
      numberOfBathrooms,
      numberOfIranianToilets,
      numberOfFarangiToilets,
      owner: req.user.id, // Set owner to current authenticated user
      status: 'pending'
    });

    await villa.save();

    // Add to user's submittedVillas
    await User.findByIdAndUpdate(req.user.id, { $push: { submittedVillas: villa._id } });

    res.status(201).json({ message: 'Villa uploaded successfully and is pending approval.', villa });
  } catch (error) {
    res.status(500).json({ message: 'Error creating villa', error: error.message });
  }
};

// Get all approved villas (public)
exports.getApprovedVillas = async (req, res) => {
  try {
    const villas = await Villa.find({ status: 'approved' }).populate('city comments reserved');
    res.json(villas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching villas', error: error.message });
  }
};

// Get a specific villa (if approved or owned by user)
exports.getVillaById = async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id).populate('city comments reserved');
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    if (villa.status === 'approved' || (req.user && villa.owner.toString() === req.user.id) || (req.user && req.user.role === 'admin')) {
      return res.json(villa);
    }

    res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching villa', error: error.message });
  }
};

// Edit a villa (only if pending and owned by user)
exports.editVilla = async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    if (villa.status !== 'pending' || villa.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your pending villas' });
    }

    const updatedFields = req.body; // Allow updating any fields except status, owner, etc.
    Object.assign(villa, updatedFields); // Merge updates

    await villa.save();
    res.json({ message: 'Villa updated successfully', villa });
  } catch (error) {
    res.status(500).json({ message: 'Error updating villa', error: error.message });
  }
};

// Admin: Get all pending villas
exports.getPendingVillas = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const villas = await Villa.find({ status: 'pending' }).populate('owner city');
    res.json(villas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending villas', error: error.message });
  }
};

// Admin: Approve a villa
exports.approveVilla = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    if (villa.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending villas can be approved' });
    }

    villa.status = 'approved';
    villa.deletionDate = null; // Clear if any
    await villa.save();

    // Optionally notify user via email/SMS (implement later)
    res.json({ message: 'Villa approved successfully', villa });
  } catch (error) {
    res.status(500).json({ message: 'Error approving villa', error: error.message });
  }
};

// Admin: Reject a villa
exports.rejectVilla = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const { rejectionReason } = req.body; // Optional reason

    const villa = await Villa.findById(req.params.id);
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    if (villa.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending villas can be rejected' });
    }

    villa.status = 'rejected';
    villa.rejectionReason = rejectionReason || '';
    villa.deletionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    await villa.save();

    // Send SMS to user (implement SMS panel later)
    // const owner = await User.findById(villa.owner);
    // if (owner.phoneNumber) {
    //   // sendSMS(owner.phoneNumber, `Your villa "${villa.name}" was rejected. Reason: ${villa.rejectionReason}. It will be deleted in 7 days.`);
    // }

    res.json({ message: 'Villa rejected successfully', villa });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting villa', error: error.message });
  }
};

// Toggle like for a villa
exports.toggleLike = async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa || villa.status !== 'approved') {
      return res.status(404).json({ message: 'Villa not found or not approved' });
    }

    const user = await User.findById(req.user.id);
    const isLiked = user.LikedVillas.includes(villa._id);

    if (isLiked) {
      user.LikedVillas.pull(villa._id);
    } else {
      user.LikedVillas.push(villa._id);
    }

    await user.save();

    res.json({ liked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

// Get past reserved dates for a villa
exports.getPastReservedDates = async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    if (villa.status === 'approved' || (req.user && villa.owner.toString() === req.user.id) || (req.user && req.user.role === 'admin')) {
      const current = moment().format('jYYYY/jMM/jDD');
      const pastReservations = await Reservation.find({
        villa: req.params.id,
        until: { $lt: current }
      }).select('from until');
      res.json(pastReservations);
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching past reserved dates', error: error.message });
  }
};