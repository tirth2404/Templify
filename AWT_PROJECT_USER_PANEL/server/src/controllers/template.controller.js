const Template = require('../models/Template');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
const getTemplates = async (req, res) => {
  try {
    const { 
      categoryId, 
      search, 
      featured, 
      premium,
      sort = '-createdAt',
      page = 1, 
      limit = 12 
    } = req.query;

    const query = { isActive: true };
    
    if (categoryId) query.categoryId = categoryId;
    if (featured === 'true') query.isFeatured = true;
    if (premium === 'true') query.isPremium = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const templates = await Template.find(query)
      .populate('categoryId', 'name masterId')
      .populate({
        path: 'categoryId',
        populate: {
          path: 'masterId',
          select: 'name'
        }
      })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Template.countDocuments(query);

    res.json({
      success: true,
      count: templates.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching templates',
      error: error.message
    });
  }
};

// @desc    Create template
// @route   POST /api/templates
// @access  Private (Admin)
const createTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Template image is required'
      });
    }

    const { name, categoryId, description, tags, dimensions, isPremium, isFeatured } = req.body;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get file info
    const stats = fs.statSync(req.file.path);
    
    const template = new Template({
      name,
      categoryId,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      imagePath: req.file.filename,
      fileSize: stats.size,
      fileFormat: path.extname(req.file.originalname).slice(1).toLowerCase(),
      dimensions: dimensions || { width: 800, height: 600 },
      isPremium: isPremium === 'true',
      isFeatured: isFeatured === 'true',
      createdBy: req.user._id
    });

    await template.save();
    await template.populate('categoryId', 'name');

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating template',
      error: error.message
    });
  }
};

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public
const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)
      .populate('categoryId', 'name masterId')
      .populate({
        path: 'categoryId',
        populate: {
          path: 'masterId',
          select: 'name'
        }
      });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Increment view count
    template.viewCount += 1;
    await template.save();

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching template',
      error: error.message
    });
  }
};

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private (Admin)
const updateTemplate = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.body.tags && typeof req.body.tags === 'string') {
      updateData.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    if (req.file) {
      // Delete old file
      const existingTemplate = await Template.findById(req.params.id);
      if (existingTemplate && existingTemplate.imagePath) {
        const oldFilePath = path.join(__dirname, '../../public/Template_images', existingTemplate.imagePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Update with new file info
      const stats = fs.statSync(req.file.path);
      updateData.imagePath = req.file.filename;
      updateData.fileSize = stats.size;
      updateData.fileFormat = path.extname(req.file.originalname).slice(1).toLowerCase();
    }

    const template = await Template.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name');

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      message: 'Template updated successfully',
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating template',
      error: error.message
    });
  }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private (Admin)
const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Delete associated file
    if (template.imagePath) {
      const filePath = path.join(__dirname, '../../public/Template_images', template.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting template',
      error: error.message
    });
  }
};

// @desc    Increment template download count
// @route   POST /api/templates/:id/download
// @access  Public
const incrementDownloadCount = async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      downloadCount: template.downloadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating download count',
      error: error.message
    });
  }
};

module.exports = {
  getTemplates,
  createTemplate,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  incrementDownloadCount
};