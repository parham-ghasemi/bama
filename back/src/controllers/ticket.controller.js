const Ticket = require('../models/ticket.model');

// User: Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) return res.status(400).json({ msg: 'Title and message are required' });

    const ticket = new Ticket({
      user: req.user.id,
      title,
      messages: [{ sender: req.user.id, message }]
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// User: Get their own tickets
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// User & Admin: Reply/Send message inside a chat thread
exports.replyToTicket = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ msg: 'Message content is required' });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    // Security: Only the ticket creator or an admin can send a message
    if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    ticket.messages.push({
      sender: req.user.id,
      message
    });

    // Automatically re-open if user replies to a closed ticket (keep it presentation-friendly)
    if (req.user.role !== 'admin') {
      ticket.status = 'open';
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin: Get all tickets globally
exports.getAdminTickets = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin access required' });

  try {
    const tickets = await Ticket.find()
      .populate('user', 'name phoneNumber')
      .sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin: Toggle close/open ticket
exports.closeTicket = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin access required' });

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    ticket.status = ticket.status === 'open' ? 'closed' : 'open';
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};