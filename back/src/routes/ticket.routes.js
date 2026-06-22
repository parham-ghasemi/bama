const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');

// User Routes
router.post('/', auth, ticketController.createTicket);
router.get('/my-tickets', auth, ticketController.getUserTickets);
router.post('/:id/reply', auth, ticketController.replyToTicket);

// Admin Routes
router.get('/admin/all', auth, isAdmin, ticketController.getAdminTickets);
router.put('/:id/toggle-status', auth, isAdmin, ticketController.closeTicket);

module.exports = router;