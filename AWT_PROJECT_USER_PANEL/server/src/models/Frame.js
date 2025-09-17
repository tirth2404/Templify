const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Frame name cannot exceed 100 characters']
  },
  imagePath: {
    type: String,
    required: [true, 'Frame image is required']
  },
  thumbnailPath: {
    type: String
  },
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
    default: 'png'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
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
frameSchema.index({ isActive: 1 });
frameSchema.index({ createdAt: -1 });

// Virtual for full image URL
frameSchema.virtual('imageUrl').get(function() {
  if (this.imagePath) {
    return `/Frame_images/${this.imagePath}`;
  }
  return null;
});

module.exports = mongoose.model('Frame', frameSchema);

// =====================================================
