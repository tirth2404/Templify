const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Template = require('../models/Template');
const Category = require('../models/Category');
const SavedDesign = require('../models/SavedDesign');
const { authMiddleware } = require('./auth');

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTemplates = await Template.countDocuments();
    const totalDesigns = await SavedDesign.countDocuments();
    const totalCategories = await Category.countDocuments();

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalTemplates,
          totalDesigns,
          totalCategories
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users: users.map(user => ({
        _id: user._id,
        companyName: user.companyName,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: user.role || 'user',
        isActive: user.isActive !== false, // Default to true if not set
        createdAt: user.createdAt,
        socialLinks: user.socialLinks
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users',
      error: error.message 
    });
  }
});

// Toggle user status
router.patch('/users/:userId/toggle-status', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      user: {
        _id: user._id,
        companyName: user.companyName,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update user status',
      error: error.message 
    });
  }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user',
      error: error.message 
    });
  }
});

module.exports = router;
