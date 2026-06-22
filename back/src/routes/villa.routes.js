const express = require('express');
const router = express.Router();
const villaController = require('../controllers/villa.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');

// =============================================
// PUBLIC ROUTES (no auth required)
// =============================================

// Get all approved villas (public)
router.get('/', villaController.getApprovedVillas);

// Search villas (public)
router.get('/search', villaController.searchVillas);

// =============================================
// AUTHENTICATED USER ROUTES
// =============================================

// Create a new villa
router.post('/', auth, villaController.createVilla);

// Toggle like for a villa
router.post('/:id/like', auth, villaController.toggleLike);

// Get like status for a villa
router.get('/:id/like', auth, villaController.getLikeStatus);

// Get past reserved dates for a villa
router.get('/:id/past-reserved', auth, villaController.getPastReservedDates);

// Create comment on a villa
router.post('/:villaId/comments', auth, require('../controllers/comment.controller').createComment);

// =============================================
// ADMIN ROUTES
// =============================================

// Get all villas (with optional status filter)
router.get('/admin', auth, isAdmin, villaController.getAllVillas);

// Get only pending villas (legacy - kept for backward compatibility)
router.get('/pending', auth, isAdmin, villaController.getPendingVillas);

// Approve a villa
router.put('/:id/approve', auth, isAdmin, villaController.approveVilla);

// Reject a villa
router.put('/:id/reject', auth, isAdmin, villaController.rejectVilla);

// Deactivate a villa
router.put('/:id/deactivate', auth, isAdmin, villaController.deactivateVilla);

// Activate a villa
router.put('/:id/activate', auth, isAdmin, villaController.activateVilla);

// =============================================
// PARAMETERIZED ROUTES (must be LAST)
// =============================================

// Get specific villa (public if approved, or owner/admin)
router.get('/:id', auth, villaController.getVillaById);

// Edit villa (owner + pending OR admin)
router.put('/:id', auth, villaController.editVilla);

module.exports = router;