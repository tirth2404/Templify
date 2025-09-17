const MasterCategory = require('../models/MasterCategory');
const Category = require('../models/Category');

// @desc    Get all master categories
// @route   GET /api/categories/masters
// @access  Public
const getMasterCategories = async (req, res) => {
  try {
    const masterCategories = await MasterCategory.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      count: masterCategories.length,
      data: masterCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching master categories',
      error: error.message
    });
  }
};

// @desc    Create master category
// @route   POST /api/categories/masters
// @access  Private (Admin)
const createMasterCategory = async (req, res) => {
  try {
    const masterCategory = new MasterCategory(req.body);
    await masterCategory.save();

    res.status(201).json({
      success: true,
      message: 'Master category created successfully',
      data: masterCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating master category',
      error: error.message
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const { masterId, search, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true };
    if (masterId) query.masterId = masterId;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const categories = await Category.find(query)
      .populate('masterId', 'name')
      .sort({ sortOrder: 1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Category.countDocuments(query);

    res.json({
      success: true,
      count: categories.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, masterId, description } = req.body;

    // Check if master category exists
    const masterCategory = await MasterCategory.findById(masterId);
    if (!masterCategory) {
      return res.status(404).json({
        success: false,
        message: 'Master category not found'
      });
    }

    const category = new Category({
      name,
      masterId,
      description
    });

    await category.save();
    await category.populate('masterId', 'name');

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('masterId', 'name');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('masterId', 'name');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

module.exports = {
  getMasterCategories,
  createMasterCategory,
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
};

// =====================================================