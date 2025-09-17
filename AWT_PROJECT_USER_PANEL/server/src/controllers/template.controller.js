// src/controllers/template.controller.js
const Template = require('../models/Template');
const Category = require('../models/Category');
const { 
  uploadToCloudinary, 
  deleteFromCloudinary, 
  getThumbnailUrl,
  getOptimizedImageUrl,
  isCloudinaryConfigured 
} = require('../config/cloudinary');
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

    // Add optimized URLs to templates (handle legacy records where imagePath stores Cloudinary public_id)
    const templatesWithUrls = templates.map(template => {
      const obj = template.toObject();
      const isCloudPublicId = !template.cloudinaryPublicId && typeof template.imagePath === 'string' && template.imagePath.includes('/');
      const cloudPublicId = template.cloudinaryPublicId || (isCloudPublicId ? template.imagePath : null);
      const imageUrl = cloudPublicId
        ? (template.cloudinaryUrl || getOptimizedImageUrl(cloudPublicId))
        : `${req.protocol}://${req.get('host')}/Template_images/${template.imagePath}`;
      const thumbnailUrl = cloudPublicId
        ? getThumbnailUrl(cloudPublicId)
        : `${req.protocol}://${req.get('host')}/Template_images/${template.imagePath}`;
      return { ...obj, imageUrl, thumbnailUrl };
    });

    res.json({
      success: true,
      count: templatesWithUrls.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      templates: templatesWithUrls
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

    let cloudinaryResult = null;
    let imagePath = req.file.filename;
    let fileSize = req.file.size;

    // Upload to Cloudinary if configured
    if (isCloudinaryConfigured()) {
      try {
        cloudinaryResult = await uploadToCloudinary(
          req.file.path, 
          'tempify/templates',
          {
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          }
        );
        
        // Update template data with Cloudinary info
        imagePath = cloudinaryResult.secure_url;
        fileSize = cloudinaryResult.bytes;
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        // Continue with local storage if Cloudinary fails
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
          success: false,
          message: 'Image upload failed',
          error: uploadError.message
        });
      }
    } else {
      // Move file to proper directory if Cloudinary not configured
      const targetDir = path.join(__dirname, '../../public/Template_images');
      const targetPath = path.join(targetDir, req.file.filename);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      fs.renameSync(req.file.path, targetPath);
    }
    
    const template = new Template({
      name,
      categoryId,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      imagePath: cloudinaryResult ? cloudinaryResult.public_id : req.file.filename,
      cloudinaryPublicId: cloudinaryResult ? cloudinaryResult.public_id : null,
      cloudinaryUrl: cloudinaryResult ? cloudinaryResult.secure_url : null,
      fileSize,
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
      data: {
        ...template.toObject(),
        imageUrl: template.imageUrl,
        thumbnailUrl: template.thumbnailUrl
      }
    });
  } catch (error) {
    // Clean up file if creation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
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
      data: {
        ...template.toObject(),
        imageUrl: template.imageUrl,
        thumbnailUrl: template.thumbnailUrl
      }
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
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    const updateData = { ...req.body };
    
    if (req.body.tags && typeof req.body.tags === 'string') {
      updateData.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    // Handle new image upload
    if (req.file) {
      let cloudinaryResult = null;

      // Delete old image from Cloudinary if exists
      if (template.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(template.cloudinaryPublicId);
        } catch (deleteError) {
          console.error('Failed to delete old image from Cloudinary:', deleteError);
        }
      } else if (template.imagePath) {
        // Delete old local file
        const oldFilePath = path.join(__dirname, '../../public/Template_images', template.imagePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Upload new image
      if (isCloudinaryConfigured()) {
        try {
          cloudinaryResult = await uploadToCloudinary(
            req.file.path, 
            'tempify/templates'
          );
          
          updateData.imagePath = cloudinaryResult.public_id;
          updateData.cloudinaryPublicId = cloudinaryResult.public_id;
          updateData.cloudinaryUrl = cloudinaryResult.secure_url;
          updateData.fileSize = cloudinaryResult.bytes;
        } catch (uploadError) {
          console.error('Cloudinary upload failed:', uploadError);
          return res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: uploadError.message
          });
        }
      } else {
        // Move to local directory
        const targetDir = path.join(__dirname, '../../public/Template_images');
        const targetPath = path.join(targetDir, req.file.filename);
        
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        
        fs.renameSync(req.file.path, targetPath);
        updateData.imagePath = req.file.filename;
        updateData.cloudinaryPublicId = null;
        updateData.cloudinaryUrl = null;
        updateData.fileSize = req.file.size;
      }
      
      updateData.fileFormat = path.extname(req.file.originalname).slice(1).toLowerCase();
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name');

    res.json({
      success: true,
      message: 'Template updated successfully',
      data: {
        ...updatedTemplate.toObject(),
        imageUrl: updatedTemplate.imageUrl,
        thumbnailUrl: updatedTemplate.thumbnailUrl
      }
    });
  } catch (error) {
    // Clean up uploaded file if update fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
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
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Delete image from Cloudinary or local storage
    if (template.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(template.cloudinaryPublicId);
      } catch (deleteError) {
        console.error('Failed to delete image from Cloudinary:', deleteError);
      }
    } else if (template.imagePath) {
      const filePath = path.join(__dirname, '../../public/Template_images', template.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Template.findByIdAndDelete(req.params.id);

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