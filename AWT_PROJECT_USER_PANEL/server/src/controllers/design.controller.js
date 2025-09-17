const SavedDesign = require('../models/SavedDesign');
const Template = require('../models/Template');

// @desc    Get user's saved designs
// @route   GET /api/designs
// @access  Private
const getUserDesigns = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, sortBy = '-createdAt' } = req.query;
    
    const query = { userId: req.user._id };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const designs = await SavedDesign.find(query)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SavedDesign.countDocuments(query);

    res.json({
      success: true,
      count: designs.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching designs',
      error: error.message
    });
  }
};

// @desc    Create saved design
// @route   POST /api/designs
// @access  Private
const createDesign = async (req, res) => {
  try {
    const designData = {
      ...req.body,
      userId: req.user._id
    };

    const design = new SavedDesign(designData);
    await design.save();

    res.status(201).json({
      success: true,
      message: 'Design saved successfully',
      design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving design',
      error: error.message
    });
  }
};

// @desc    Get design by ID
// @route   GET /api/designs/:id
// @access  Private
const getDesignById = async (req, res) => {
  try {
    const design = await SavedDesign.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    res.json({
      success: true,
      data: design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching design',
      error: error.message
    });
  }
};

// @desc    Update design
// @route   PUT /api/designs/:id
// @access  Private
const updateDesign = async (req, res) => {
  try {
    const design = await SavedDesign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, lastModified: new Date() },
      { new: true, runValidators: true }
    );

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    res.json({
      success: true,
      message: 'Design updated successfully',
      design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating design',
      error: error.message
    });
  }
};

// @desc    Delete design
// @route   DELETE /api/designs/:id
// @access  Private
const deleteDesign = async (req, res) => {
  try {
    const design = await SavedDesign.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    res.json({
      success: true,
      message: 'Design deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting design',
      error: error.message
    });
  }
};

// @desc    Duplicate design
// @route   POST /api/designs/:id/duplicate
// @access  Private
const duplicateDesign = async (req, res) => {
  try {
    const originalDesign = await SavedDesign.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!originalDesign) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    const duplicatedDesign = new SavedDesign({
      ...originalDesign.toObject(),
      _id: undefined,
      name: `${originalDesign.name} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined,
      version: 1
    });

    await duplicatedDesign.save();

    res.status(201).json({
      success: true,
      message: 'Design duplicated successfully',
      design: duplicatedDesign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error duplicating design',
      error: error.message
    });
  }
};

// @desc    Get public designs
// @route   GET /api/designs/public
// @access  Public
const getPublicDesigns = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, tags } = req.query;
    
    const query = { isPublic: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const designs = await SavedDesign.find(query)
      .populate('userId', 'companyName')
      .sort({ downloadCount: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SavedDesign.countDocuments(query);

    res.json({
      success: true,
      count: designs.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching public designs',
      error: error.message
    });
  }
};

module.exports = {
  getUserDesigns,
  createDesign,
  getDesignById,
  updateDesign,
  deleteDesign,
  duplicateDesign,
  getPublicDesigns
};