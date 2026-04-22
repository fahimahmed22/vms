require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = (process.env.FRONTEND_URL ||
  'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ⭐ handle preflight globally

/* =========================
   MANUAL HEADERS (Vercel FIX)
========================= */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(helmet());

/* =========================
   DEBUG (optional)
========================= */
// Uncomment if needed
// app.use((req, res, next) => {
//   console.log('Origin:', req.headers.origin);
//   next();
// });

/* =========================
   ROUTES
========================= */
app.use('/api', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/visitor', require('./routes/visitor'));
app.use('/api/employee', require('./routes/employee'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/qr', require('./routes/qr'));

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.message);
  res.status(500).json({
    message: err.message || 'Something went wrong'
  });
});

/* =========================
   DATABASE + SERVER START
========================= */
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;