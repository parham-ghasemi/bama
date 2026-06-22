const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { auth } = require('../middleware/auth.middleware');

router.put('/:id', auth, commentController.editComment);
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;