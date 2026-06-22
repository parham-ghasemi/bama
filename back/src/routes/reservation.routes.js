const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { auth } = require('../middleware/auth.middleware');

router.post('/', auth, reservationController.createReservation);

module.exports = router;