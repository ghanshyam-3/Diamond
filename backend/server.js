const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const diamondRoutes = require('./routes/diamondRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const qrRoutes = require('./routes/qrRoutes');
const User = require('./models/User');


dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/diamonds', diamondRoutes);
app.use('/api', assignmentRoutes);
app.use('/api', qrRoutes);
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// to serve qr images
app.use('/qr', express.static('qr'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
