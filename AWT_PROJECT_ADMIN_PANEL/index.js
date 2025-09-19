const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// ✅ Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizpostify';
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Add connection event listeners for better debugging
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

// ✅ Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Default route to serve admin.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ✅ Test route to verify server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// ✅ Import and use routes
try {
  const { router: authRoutes } = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');

  const addMasterCategoryRoute = require('./routes/addMasterCategory');
  app.use('/api/add-master-category', addMasterCategoryRoute);
  console.log('✅ Master category route loaded');

  const categoryRoutes = require('./routes/category');
  console.log('Category routes object:', typeof categoryRoutes);
  try {
    app.use('/api/category', categoryRoutes);
    console.log('✅ Category routes loaded');
  } catch (routeError) {
    console.error('❌ Error mounting category routes:', routeError);
  }

  const templateRoutes = require('./routes/template');
  app.use('/api/template', templateRoutes);
  console.log('✅ Template routes loaded');

  const frameRoutes = require('./routes/frame');
  app.use('/api/frame', frameRoutes);
  console.log('✅ Frame routes loaded');

  const savedDesignRoutes = require('./routes/savedDesigns');
  app.use('/api/saved-designs', savedDesignRoutes);
  console.log('✅ Saved designs routes loaded');

  const adminRoutes = require('./routes/admin');
  app.use('/api/admin', adminRoutes);
  console.log('✅ Admin routes loaded');
} catch (error) {
  console.error('❌ Error loading routes:', error);
}

// ✅ Error handling for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
