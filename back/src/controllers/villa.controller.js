const Villa = require('../models/villa.model');
const User = require('../models/user.model');
const City = require('../models/city.model');
const Reservation = require('../models/reservation.model');

// Create a new villa
exports.createVilla = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Profile check
    if (!user.name.first || !user.name.last || !user.gender || !user.birthdate || !user.email || !user.homeNumber) {
      return res.status(400).json({ message: 'لطفاً ابتدا پروفایل خود را تکمیل کنید.' });
    }

    const {
      name, address, extraInformation, rules, items, images, price,
      maxAdults, maxChildren, city, numberOfRooms, numberOfDoubleBeds,
      numberOfBeds, numberOfBathrooms, numberOfIranianToilets, numberOfFarangiToilets
    } = req.body;

    // Convert city name → ObjectId
    const cityDoc = await City.findOne({ name: city });
    if (!cityDoc) {
      return res.status(400).json({ message: "شهر وارد شده یافت نشد" });
    }

    const villa = new Villa({
      name,
      address,
      extraInformation: extraInformation || '',
      rules,
      items,
      images,                    // array of URLs from upload
      price,
      maxAdults,
      maxChildren: maxChildren || 0,
      city: cityDoc._id,
      numberOfRooms: numberOfRooms || 0,
      numberOfDoubleBeds: numberOfDoubleBeds || 0,
      numberOfBeds: numberOfBeds || 0,
      numberOfBathrooms: numberOfBathrooms || 0,
      numberOfIranianToilets: numberOfIranianToilets || 0,
      numberOfFarangiToilets: numberOfFarangiToilets || 0,
      owner: req.user.id,
      status: 'pending'
    });

    await villa.save();

    // Add to user's submitted villas
    await User.findByIdAndUpdate(req.user.id, { $push: { submittedVillas: villa._id } });

    res.status(201).json({
      message: 'ویلا با موفقیت ثبت شد و در حال بررسی است.',
      villa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطا در ثبت ویلا', error: error.message });
  }
};

// Get all approved villas (public)
exports.getApprovedVillas = async (req, res) => {
  try {
    const villas = await Villa.find({ status: 'approved' })
      .populate('city reserved')
      .populate({
        path: 'comments',
        populate: {
          path: 'from',
          select: 'name' // Only fetch the name object to keep it lightweight
        }
      });
    res.json(villas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching villas', error: error.message });
  }
};

// Get a specific villa (if approved or owned by user)
exports.getVillaById = async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id)
      .populate('city reserved')
      .populate({
        path: 'comments',
        populate: {
          path: 'from',
          select: 'name'
        }
      });
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


// Admin: Get all pending villas
exports.getPendingVillas = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const villas = await Villa.find({ status: 'pending' })
      .populate('owner city')
      .populate({
        path: 'comments',
        populate: {
          path: 'from',
          select: 'name'
        }
      });
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
    const wasLiked = user.LikedVillas.includes(villa._id);

    if (wasLiked) {
      user.LikedVillas.pull(villa._id);
    } else {
      user.LikedVillas.push(villa._id);
    }

    await user.save();

    res.json({ isLiked: !wasLiked });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

// Get like status for a villa
exports.getLikeStatus = async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa || villa.status !== 'approved') {
      return res.status(404).json({ message: 'Villa not found or not approved' });
    }

    const user = await User.findById(req.user.id);
    const isLiked = user.LikedVillas.includes(villa._id);

    res.json({ isLiked });
  } catch (error) {
    res.status(500).json({ message: 'Error getting like status', error: error.message });
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

// Search villas (public) – used by the header
exports.searchVillas = async (req, res) => {
  try {
    const { city: cityName, entryDate, exitDate, adults, children } = req.query;

    if (!cityName) {
      return res.status(400).json({ message: 'City name is required' });
    }

    // Find city by exact Persian name
    const cityDoc = await City.findOne({ name: cityName.trim() });
    if (!cityDoc) {
      return res.json([]);
    }

    const adultsNum = parseInt(adults) || 1;
    const childrenNum = parseInt(children) || 0;

    // Base query – approved villas in the city with enough capacity
    let candidates = await Villa.find({
      status: 'approved',
      city: cityDoc._id,
      maxAdults: { $gte: adultsNum },
      maxChildren: { $gte: childrenNum }
    })
      .populate('city')           // we need city.name for the card
      .populate({
        path: 'comments',
        populate: {
          path: 'from',
          select: 'name'
        }
      })
      .sort({ price: 1 });        // cheapest first

    let availableVillas = candidates;

    // If dates are provided → filter out overlapping reservations
    if (entryDate && exitDate) {
      const overlapping = await Reservation.find({
        villa: { $in: candidates.map(v => v._id) },
        from: { $lte: exitDate },
        until: { $gte: entryDate }
      }).select('villa');

      const overlappingIds = new Set(overlapping.map(r => r.villa.toString()));

      availableVillas = candidates.filter(v => !overlappingIds.has(v._id.toString()));
    }

    res.json(availableVillas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching villas', error: error.message });
  }
};

// === NEW: Admin - Get all villas (with status filter) ===
exports.getAllVillas = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const { status = 'all' } = req.query;

    const query = status !== 'all' ? { status } : {};
    const villas = await Villa.find(query)
      .populate('owner', 'name')           // name.first + name.last
      .populate('city', 'name')            // you can add province later
      .populate({
        path: 'comments',
        populate: {
          path: 'from',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    res.json(villas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching villas', error: error.message });
  }
};

// === NEW: Admin - Deactivate villa ===
exports.deactivateVilla = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) return res.status(404).json({ message: 'Villa not found' });

    villa.status = 'inactive';
    await villa.save();

    res.json({ message: 'Villa deactivated successfully', villa });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating villa', error: error.message });
  }
};
exports.activateVilla = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) return res.status(404).json({ message: 'Villa not found' });

    villa.status = 'approved';
    await villa.save();

    res.json({ message: 'Villa activated successfully', villa });
  } catch (error) {
    res.status(500).json({ message: 'Error activating villa', error: error.message });
  }
};

// === UPDATED: Allow admin to edit any villa ===
exports.editVilla = async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) return res.status(404).json({ message: 'Villa not found' });

    // Owner can only edit pending villas, admin can edit anything
    if (req.user.role !== 'admin' && (villa.status !== 'pending' || villa.owner.toString() !== req.user.id)) {
      return res.status(403).json({ message: 'You can only edit your pending villas' });
    }

    Object.assign(villa, req.body);
    await villa.save();
    res.json({ message: 'Villa updated successfully', villa });
  } catch (error) {
    res.status(500).json({ message: 'Error updating villa', error: error.message });
  }
};