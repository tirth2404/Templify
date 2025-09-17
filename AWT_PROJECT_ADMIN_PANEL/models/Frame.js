const mongoose = require('mongoose');

const FrameSchema = new mongoose.Schema({
  img: { 
    type: String, 
    required: true 
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Frame', FrameSchema);
