const express = require('express');
const router = express.Router();
const MasterCategory = require('../models/MasterCategory');

// POST route to add master category
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  try {
    const newCategory = new MasterCategory({ name });
    const savedCategory = await newCategory.save();

    res.status(200).json({
      success: true,
      message: 'Master category added successfully',
      category: savedCategory
    });
  } catch (error) {
    console.error('MongoDB insert error:', error);
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
});

module.exports = router;
