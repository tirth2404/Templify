const express = require('express');
const mongoose = require('mongoose');
const Category = require('./models/Category');
const MasterCategory = require('./models/MasterCategory');

const app = express();
const port = 3001;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bizpostify')
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Test route to add a master category
app.post('/test-master', async (req, res) => {
  try {
    const newMaster = new MasterCategory({ name: 'Test Master Category' });
    const saved = await newMaster.save();
    console.log('Saved master category:', saved);
    res.json({ success: true, data: saved });
  } catch (error) {
    console.error('Error saving master category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test route to add a category
app.post('/test-category', async (req, res) => {
  try {
    // First get a master category
    const master = await MasterCategory.findOne();
    if (!master) {
      return res.status(400).json({ success: false, error: 'No master category found' });
    }
    
    const newCategory = new Category({ 
      name: 'Test Category', 
      master_id: master._id 
    });
    const saved = await newCategory.save();
    console.log('Saved category:', saved);
    res.json({ success: true, data: saved });
  } catch (error) {
    console.error('Error saving category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test route to get all data
app.get('/test-data', async (req, res) => {
  try {
    const masters = await MasterCategory.find();
    const categories = await Category.find().populate('master_id');
    
    console.log('Masters:', masters);
    console.log('Categories:', categories);
    
    res.json({
      masters: masters,
      categories: categories,
      masterCount: masters.length,
      categoryCount: categories.length
    });
  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Test server running on http://localhost:${port}`);
});
