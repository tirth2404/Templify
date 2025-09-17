const express = require('express');
const router = express.Router();
const {
  getUserDesigns,
  createDesign,
  getDesignById,
  updateDesign,
  deleteDesign,
  duplicateDesign,
  getPublicDesigns
} = require('../controllers/design.controller');
const { auth, optionalAuth } = require('../middleware/auth.middleware');
const {
  validateSaveDesign,
  validateObjectId,
  validatePagination
} = require('../middleware/validation.middleware');

// Public routes
router.get('/public', validatePagination, getPublicDesigns);

// Protected routes
router.get('/', auth, validatePagination, getUserDesigns);
router.post('/', auth, validateSaveDesign, createDesign);
router.get('/:id', auth, validateObjectId, getDesignById);
router.put('/:id', auth, validateObjectId, updateDesign);
router.delete('/:id', auth, validateObjectId, deleteDesign);
router.post('/:id/duplicate', auth, validateObjectId, duplicateDesign);

module.exports = router;
