const mongoose = require('mongoose');

const masterCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Master category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Master category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
masterCategorySchema.index({ name: 1 });
masterCategorySchema.index({ slug: 1 });
masterCategorySchema.index({ isActive: 1, sortOrder: 1 });

// Generate slug before saving
masterCategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').trim('-');
  }
  next();
});

module.exports = mongoose.model('MasterCategory', masterCategorySchema);