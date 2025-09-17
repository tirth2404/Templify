const express = require('express');
const SavedDesign = require('../models/SavedDesign');
const { authMiddleware } = require('./auth');

const router = express.Router();

// Create
router.post('/', authMiddleware, async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const created = await SavedDesign.create(payload);
    return res.json({ success: true, design: created });
  } catch (err) {
    console.error('Create design error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// List
router.get('/', authMiddleware, async (req, res) => {
  try {
    const designs = await SavedDesign.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, designs });
  } catch (err) {
    console.error('List designs error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await SavedDesign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Design not found' });
    return res.json({ success: true, design: updated });
  } catch (err) {
    console.error('Update design error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await SavedDesign.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Design not found' });
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete design error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;


