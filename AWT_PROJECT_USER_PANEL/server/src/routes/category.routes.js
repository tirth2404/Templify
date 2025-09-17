const express = require('express');
const router = express.Router();
const {
  getMasterCategories,
  createMasterCategory,
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const {
  validateMasterCategory,
  validateCategory,
  validateObjectId,
  validatePagination
} = require('../middleware/validation.middleware');

// Master categories routes
router.get('/masters', getMasterCategories);
router.post('/masters', adminAuth, validateMasterCategory, createMasterCategory);

// Regular categories routes
router.get('/', validatePagination, getCategories);
router.post('/', adminAuth, validateCategory, createCategory);
router.get('/:id', validateObjectId, getCategoryById);
router.put('/:id', adminAuth, validateObjectId, validateCategory, updateCategory);
router.delete('/:id', adminAuth, validateObjectId, deleteCategory);

// Legacy routes
router.get('/master-categories', getMasterCategories);
router.get('/all', validatePagination, getCategories);
router.post('/add-category', adminAuth, validateCategory, createCategory);

module.exports = router;
