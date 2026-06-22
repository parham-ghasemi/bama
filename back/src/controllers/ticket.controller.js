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

    // Map before responding
    const ticketObj = ticket.toObject();
    ticketObj.messages = ticketObj.messages.map(msg => ({
      ...msg,
      sender: msg.sender.toString() === ticketObj.user.toString() ? 'user' : 'admin'
    }));

    res.status(201).json(ticketObj);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// User: Get their own tickets
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort({ updatedAt: -1 }).lean();

    // Safely transform sender field for presentation security
    const sanitizedTickets = tickets.map(ticket => ({
      ...ticket,
      messages: ticket.messages.map(msg => ({
        ...msg,
        sender: msg.sender.toString() === ticket.user.toString() ? 'user' : 'admin'
      }))
    }));

    res.json(sanitizedTickets);
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

    // Automatically re-open if user replies to a closed ticket
    if (req.user.role !== 'admin') {
      ticket.status = 'open';
    }

    await ticket.save();

    // Sanitize payload right before delivery
    const ticketObj = ticket.toObject();
    ticketObj.messages = ticketObj.messages.map(msg => ({
      ...msg,
      sender: msg.sender.toString() === ticketObj.user.toString() ? 'user' : 'admin'
    }));

    res.json(ticketObj);
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
      .sort({ updatedAt: -1 })
      .lean();

    // Optional: You can do the exact same sanitization here if you want consistency 
    // for your admin view UI definitions too!
    const sanitizedTickets = tickets.map(ticket => ({
      ...ticket,
      messages: ticket.messages.map(msg => ({
        ...msg,
        sender: msg.sender.toString() === ticket.user?._id?.toString() ? 'user' : 'admin'
      }))
    }));

    res.json(sanitizedTickets);
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

    const ticketObj = ticket.toObject();
    ticketObj.messages = ticketObj.messages.map(msg => ({
      ...msg,
      sender: msg.sender.toString() === ticketObj.user.toString() ? 'user' : 'admin'
    }));

    res.json(ticketObj);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};