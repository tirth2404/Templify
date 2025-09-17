const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  // legacy local filename; keep optional for backward compatibility
  path: { 
    type: String
  },
  // field used by user server
  imagePath: {
    type: String
  },
  cloudinaryPublicId: {
    type: String
  },
  cloudinaryUrl: {
    type: String
  },
  category_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Template', TemplateSchema);
