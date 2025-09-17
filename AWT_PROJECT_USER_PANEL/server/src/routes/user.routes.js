const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const SavedDesign = require('../models/SavedDesign');
const Template = require('../models/Template');

// User dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    const [
      totalDesigns,
      recentDesigns,
      favoriteTemplates
    ] = await Promise.all([
      SavedDesign.countDocuments({ userId: req.user._id }),
      SavedDesign.find({ userId: req.user._id })
        .sort({ updatedAt: -1 })
        .limit(5),
      Template.find({ isActive: true, isFeatured: true })
        .sort({ downloadCount: -1 })
        .limit(6)
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalDesigns
        },
        recentDesigns,
        favoriteTemplates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// User activity
router.get('/activity', auth, async (req, res) => {
  try {
    const designs = await SavedDesign.find({ userId: req.user._id })
      .select('name createdAt updatedAt downloadCount')
      .sort({ updatedAt: -1 })
      .limit(20);

    const activity = designs.map(design => ({
      type: 'design_updated',
      title: `Updated "${design.name}"`,
      timestamp: design.updatedAt,
      data: { designId: design._id }
    }));

    res.json({
      success: true,
      activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user activity',
      error: error.message
    });
  }
});

module.exports = router;
