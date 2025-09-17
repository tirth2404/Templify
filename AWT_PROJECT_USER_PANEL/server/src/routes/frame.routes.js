const express = require('express');
const router = express.Router();
const {
  getFrames,
  createFrame,
  createFrameWithElements,
  getFrameById,
  getFramesWithElements,
  updateFrame,
  deleteFrame
} = require('../controllers/frame.controller');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const { uploadFrame } = require('../middleware/upload.middleware');
const {
  validateObjectId,
  validatePagination
} = require('../middleware/validation.middleware');

// Public routes
router.get('/', validatePagination, getFrames);
router.get('/all', validatePagination, getFrames); // Legacy route
router.get('/all-with-elements', getFramesWithElements);
router.get('/:id', validateObjectId, getFrameById);
router.get('/with-elements/:frameId', validateObjectId, getFrameById); // Legacy route

// Admin routes
router.post('/', adminAuth, uploadFrame.single('frameImage'), createFrame);
router.post('/upload', adminAuth, uploadFrame.single('frameImage'), createFrame); // Legacy route
router.post('/upload-with-elements', adminAuth, uploadFrame.single('frameImage'), createFrameWithElements);
router.post('/with-elements', adminAuth, uploadFrame.single('frameImage'), createFrameWithElements);
router.put('/:id', adminAuth, validateObjectId, uploadFrame.single('frameImage'), updateFrame);
router.delete('/:id', adminAuth, validateObjectId, deleteFrame);

module.exports = router;
