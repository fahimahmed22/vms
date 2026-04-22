require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined. Set it in Vercel Environment Variables.');
}

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
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(null, false); // don't crash
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* =========================
   MANUAL HEADERS (Vercel SAFETY)
========================= */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(helmet());

/* =========================
   DATABASE (SERVERLESS SAFE)
========================= */

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const err = new Error('MONGODB_URI is required but not set.');
    console.error('❌', err.message);
    throw err;
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = conn.connections[0].readyState;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err);
    throw err;
  }
};

// Ensure DB before handling routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

/* =========================
   TEST ROUTE
========================= */
app.get('/', (req, res) => {
  res.json({ message: 'API is working 🚀' });
});

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
  console.error('🔥 ERROR:', err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong'
  });
});

/* =========================
   EXPORT (IMPORTANT)
========================= */
module.exports = app;