const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const visitorRouter = require('./routes/visitor');
const employeeRouter = require('./routes/employee');
const adminRouter = require('./routes/admin');

const qrRouter = require('./routes/qr');

app.use('/api', authRouter);
app.use('/api/user', userRouter);
app.use('/api/visitor', visitorRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/qr', qrRouter);

app.listen(process.env.PORT || 5000, () => console.log('Backend running on port', process.env.PORT || 5000));
