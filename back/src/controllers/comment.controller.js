const moment = require('moment-jalaali');
const Comment = require('../models/comment.model');
const Villa = require('../models/villa.model');
const Reservation = require('../models/reservation.model');

exports.createComment = async (req, res) => {
  try {
    const { content, image, rating } = req.body;
    const villaId = req.params.villaId;

    const villa = await Villa.findById(villaId);
    if (!villa || villa.status !== 'approved') {
      return res.status(404).json({ message: 'Villa not found or not approved' });
    }

    // Check if user has past reservation
    const current = moment().format('jYYYY/jMM/jDD');
    const hasReserved = await Reservation.findOne({
      user: req.user.id,
      villa: villaId,
      until: { $lt: current }
    });

    if (!hasReserved) {
      return res.status(403).json({ message: 'You can only comment if you have stayed here' });
    }

    const comment = new Comment({
      from: req.user.id,
      content,
      image,
      rating,
      date: moment().format('jYYYY/jMM/jDD')
    });

    await comment.save();

    villa.comments.push(comment._id);
    await villa.save();

    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

exports.editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.from.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { content, image, rating } = req.body;
    if (content) comment.content = content;
    if (image !== undefined) comment.image = image;
    if (rating) comment.rating = rating;

    await comment.save();

    res.json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.from.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove from villa
    await Villa.updateOne({ comments: req.params.id }, { $pull: { comments: req.params.id } });

    await Comment.deleteOne({ _id: req.params.id });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};