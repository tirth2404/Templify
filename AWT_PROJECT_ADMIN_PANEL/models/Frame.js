const mongoose = require('mongoose');

const FrameSchema = new mongoose.Schema({
  // legacy local filename; keep optional for backward compatibility
  img: { 
    type: String
  },
  // align with user server schema
  imagePath: {
    type: String
  },
  cloudinaryPublicId: {
    type: String
  },
  cloudinaryUrl: {
    type: String
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Frame', FrameSchema);
