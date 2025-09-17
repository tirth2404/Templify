const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  path: { 
    type: String, 
    required: true 
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
