const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxlength: [100, 'Template name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  imagePath: {
    type: String,
    required: [true, 'Template image is required']
  },
  thumbnailPath: {
    type: String
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  dimensions: {
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 }
  },
  fileSize: {
    type: Number // in bytes
  },
  fileFormat: {
    type: String,
    enum: ['jpg', 'jpeg', 'png', 'webp'],
    default: 'jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
templateSchema.index({ name: 1 });
templateSchema.index({ slug: 1 });
templateSchema.index({ categoryId: 1, isActive: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ isFeatured: 1, isActive: 1 });
templateSchema.index({ downloadCount: -1 });
templateSchema.index({ createdAt: -1 });

// Generate slug before saving
templateSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').trim('-');
  }
  next();
});

// Virtual for full image URL
templateSchema.virtual('imageUrl').get(function() {
  if (this.imagePath) {
    return `/Template_images/${this.imagePath}`;
  }
  return null;
});

// Virtual for thumbnail URL
templateSchema.virtual('thumbnailUrl').get(function() {
  if (this.thumbnailPath) {
    return `/Template_images/${this.thumbnailPath}`;
  }
  return this.imageUrl; // fallback to main image
});

module.exports = mongoose.model('Template', templateSchema);

// =====================================================
