const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const MasterCategory = require('../models/MasterCategory');

// ✅ Add category
// ✅ Add category using GET (not recommended for real use, only for testing)
router.post('/add-category', async (req, res) => {
    const { name, master_id } = req.body;
  
    console.log('Received category data via POST:', { name, master_id });
  
    if (!name || !master_id) {
      return res.status(400).json({ success: false, error: 'Name and master_id are required.' });
    }
  
    try {
      // Check if master category exists
      const masterCategory = await MasterCategory.findById(master_id);
      if (!masterCategory) {
        return res.status(404).json({ success: false, error: 'Master category not found' });
      }
  
      const newCategory = new Category({ name, master_id });
      const savedCategory = await newCategory.save();
  
      console.log('Category added:', savedCategory);
      res.status(201).json({ success: true, category: savedCategory });
    } catch (error) {
      console.error('POST /add-category error:', error);
      res.status(500).json({ success: false, error: 'Database error', details: error.message });
    }
  });
  
  

// ✅ Fetch all master categories
router.get('/master-categories', async (req, res) => {
  try {
    const masters = await MasterCategory.find();
    console.log('Fetched master categories:', masters);
    res.json(masters);
  } catch (error) {
    console.error('Error fetching master categories:', error);
    res.status(500).json({ error: 'Failed to fetch master categories' });
  }
});

// ✅ Get all categories
router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find().populate('master_id');
    console.log('Fetched all categories:', categories);
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// ✅ Debug route to check all categories
router.get('/debug', async (req, res) => {
  try {
    const categories = await Category.find().populate('master_id');
    const masterCategories = await MasterCategory.find();
    
    console.log('Debug - All categories:', categories);
    console.log('Debug - All master categories:', masterCategories);
    
    res.json({
      categories: categories,
      masterCategories: masterCategories,
      categoryCount: categories.length,
      masterCategoryCount: masterCategories.length
    });
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({ error: 'Debug route failed', details: error.message });
  }
});

module.exports = router;
