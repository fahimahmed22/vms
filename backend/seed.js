const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'employee1', password: 'employee123', role: 'employee' },
  { username: 'employee2', password: 'employee123', role: 'employee' },
  { username: 'visitor1', password: 'visitor123', role: 'visitor' },
  { username: 'visitor2', password: 'visitor123', role: 'visitor' }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await User.deleteMany({});
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await User.create({ username: u.username, password: hash, role: u.role });
  }
  console.log('Seeded users!');
  mongoose.disconnect();
}

seed();
