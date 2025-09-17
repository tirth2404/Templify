const express = require('express');
const router = express.Router();
const {
  getMasterCategories,
  createMasterCategory,
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const {
  validateMasterCategory,
  validateCategory,
  validateObjectId,
  validatePagination
} = require('../middleware/validation.middleware');

// Master categories routes
router.get('/masters', getMasterCategories);
router.post('/masters', adminAuth, validateMasterCategory, createMasterCategory);

// Regular categories routes
router.get('/', validatePagination, getCategories);
router.post('/', adminAuth, validateCategory, createCategory);
router.get('/:id', validateObjectId, getCategoryById);
router.put('/:id', adminAuth, validateObjectId, validateCategory, updateCategory);
router.delete('/:id', adminAuth, validateObjectId, deleteCategory);

// Legacy routes for existing admin/frontend
router.get('/master-categories', getMasterCategories);
router.get('/all', async (req, res) => {
  try {
    const categories = await require('../models/Category')
      .find({ isActive: true })
      .populate('masterId', 'name')
      .sort({ sortOrder: 1, name: 1 });
    
    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

router.post('/add-category', adminAuth, async (req, res) => {
  try {
    const { name, master_id } = req.body;

    if (!name || !master_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and master_id are required.' 
      });
    }

    const Category = require('../models/Category');
    const MasterCategory = require('../models/MasterCategory');

    // Check if master category exists
    const masterCategory = await MasterCategory.findById(master_id);
    if (!masterCategory) {
      return res.status(404).json({ 
        success: false, 
        error: 'Master category not found' 
      });
    }

    const newCategory = new Category({ 
      name, 
      masterId: master_id 
    });
    
    const savedCategory = await newCategory.save();
    await savedCategory.populate('masterId', 'name');

    res.status(201).json({ 
      success: true, 
      category: savedCategory 
    });
  } catch (error) {
    console.error('POST /add-category error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database error', 
      details: error.message 
    });
  }
});

module.exports = router;