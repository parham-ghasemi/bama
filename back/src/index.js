const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ======================
   Middleware
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   MongoDB Connection
====================== */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();

/* ======================
   Routes
====================== */
const path = require('path');

app.use(
  express.static(
    path.join(__dirname, '..', 'public')
  )
);


app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

const uploadRoutes = require('./routes/upload.routes');
app.use('/api/upload', uploadRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api/user', userRoutes);

const commentRoutes = require('./routes/comment.routes');
app.use('/api', commentRoutes);

const reservationRoutes = require('./routes/reservation.routes');
app.use('/api/reservations', reservationRoutes);

const villaRoutes = require('./routes/villa.routes');
app.use('/api/villas', villaRoutes);

const ticketRoutes = require('./routes/ticket.routes');
app.use('/api/tickets', ticketRoutes);

/* ======================
   Start Server
====================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
