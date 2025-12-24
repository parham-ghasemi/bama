const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

const userRoutes = require('./routes/user.routes');
app.use('/api/user', userRoutes);

const commentRoutes = require('./routes/comment.routes');
app.use('/api', commentRoutes);

const reservationRoutes = require('./routes/reservation.routes');
app.use('/api', reservationRoutes);

const villaRoutes = require('./routes/villa.routes');
app.use('/api', villaRoutes);

/* ======================
   Start Server
====================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
