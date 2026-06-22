const moment = require('moment-jalaali');
const axios = require('axios');
const Comment = require('../models/comment.model');
const Villa = require('../models/villa.model');
const Reservation = require('../models/reservation.model');

async function generateAISummary(villaId) {
  const villa = await Villa.findById(villaId).populate('comments');
  if (!villa || villa.comments.length === 0) {
    villa.aiSummary = '';
    await villa.save();
    return;
  }

  const commentsText = villa.comments.map(c => c.content).join('\n');
  const prompt = `لطفا خلاصه ای کوتاه (حداکثر ۱۰۰ کلمه) از نظرات کاربران زیر بنویسید. خلاصه باید به زبان فارسی باشد، نقاط مثبت و منفی را برجسته کند و بر اساس نظرات واقعی باشد:\n${commentsText}`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'meta-llama/llama-3.1-70b-instruct',
      messages: [
        { role: 'user', content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const summary = response.data.choices[0].message.content.trim();
    villa.aiSummary = summary;
    await villa.save();
  } catch (error) {
    console.error('Error generating AI summary:', error);
    // Optionally handle error, e.g., leave summary unchanged
  }
}

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

    const comment = new Comment({
      from: req.user.id,
      villa: villaId,
      content,
      image,
      rating,
      date: moment().format('jYYYY/jMM/jDD'),
      hasBooked: !!hasReserved
    });

    await comment.save();

    villa.comments.push(comment._id);
    await villa.save();

    await generateAISummary(villaId);

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

    await generateAISummary(comment.villa);

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

    const villaId = comment.villa;

    // Remove from villa
    await Villa.updateOne({ comments: req.params.id }, { $pull: { comments: req.params.id } });

    await Comment.deleteOne({ _id: req.params.id });

    await generateAISummary(villaId);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};