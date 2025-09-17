const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Template = require('../models/Template');
const SavedDesign = require('../models/SavedDesign');
const { adminAuth } = require('../middleware/auth.middleware');
const { validatePagination } = require('../middleware/validation.middleware');

// Admin stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalTemplates,
      totalDesigns,
      activeUsers,
      recentTemplates,
      popularTemplates
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Template.countDocuments({ isActive: true }),
      SavedDesign.countDocuments(),
      User.countDocuments({ 
        role: 'user', 
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
      Template.find({ isActive: true }).sort({ createdAt: -1 }).limit(5),
      Template.find({ isActive: true }).sort({ downloadCount: -1 }).limit(5)
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalTemplates,
          totalDesigns,
          activeUsers
        },
        recentTemplates,
        popularTemplates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats',
      error: error.message
    });
  }
});

// All users
router.get('/users', adminAuth, validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Toggle user status
router.patch('/users/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.displayInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await SavedDesign.deleteMany({ userId: req.params.id });
    res.json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

module.exports = router;
