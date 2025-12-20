const express = require('express');
const router = express.Router();
const villaController = require('../controllers/villaController');
const { auth, isAdmin } = require('../middleware/auth'); // Adjust path to your auth middleware

// Create villa (authenticated user)
router.post('/', auth, villaController.createVilla);

// Get all approved villas (public)
router.get('/', villaController.getApprovedVillas);

// Get specific villa (public if approved, or owner/admin)
router.get('/:id', auth, villaController.getVillaById); // auth optional? For now, require auth, but can make optional if needed

// Edit villa (authenticated owner, pending only)
router.put('/:id', auth, villaController.editVilla);

// Admin: Get pending villas
router.get('/pending', auth, isAdmin, villaController.getPendingVillas);

// Admin: Approve villa
router.put('/:id/approve', auth, isAdmin, villaController.approveVilla);

// Admin: Reject villa
router.put('/:id/reject', auth, isAdmin, villaController.rejectVilla);

module.exports = router;