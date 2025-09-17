const express = require('express');
const router = express.Router();
const {
  getTemplates,
  createTemplate,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  incrementDownloadCount
} = require('../controllers/template.controller');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth.middleware');
const { uploadTemplate } = require('../middleware/upload.middleware');
const {
  validateTemplate,
  validateObjectId,
  validatePagination
} = require('../middleware/validation.middleware');

// Public routes
router.get('/', validatePagination, getTemplates);
router.get('/all', validatePagination, getTemplates); // Legacy route
router.get('/:id', validateObjectId, getTemplateById);
router.post('/:id/download', validateObjectId, incrementDownloadCount);

// Admin routes
router.post('/', adminAuth, uploadTemplate.single('templateImage'), createTemplate);
router.post('/upload', adminAuth, uploadTemplate.single('templateImage'), createTemplate); // Legacy route
router.put('/:id', adminAuth, validateObjectId, uploadTemplate.single('templateImage'), updateTemplate);
router.delete('/:id', adminAuth, validateObjectId, deleteTemplate);

// Category-specific routes
router.get('/by-category/:categoryId', validateObjectId, validatePagination, getTemplates);

module.exports = router;
