const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'shape'],
    required: [true, 'Element type is required']
  },
  content: { type: String }, // For text elements
  src: { type: String }, // For image elements
  position: {
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
    z: { type: Number, default: 0 } // For layering
  },
  dimensions: {
    width: { type: Number, default: 100 },
    height: { type: Number, default: 50 }
  },
  styling: {
    fontSize: { type: Number, default: 16 },
    fontFamily: { type: String, default: 'Arial' },
    fontWeight: { type: String, default: 'normal' },
    color: { type: String, default: '#000000' },
    backgroundColor: { type: String, default: 'transparent' },
    borderRadius: { type: Number, default: 0 },
    opacity: { type: Number, default: 1, min: 0, max: 1 },
    rotation: { type: Number, default: 0 }
  },
  isLocked: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true }
}, { _id: false });

const savedDesignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Design name is required'],
    trim: true,
    maxlength: [100, 'Design name cannot exceed 100 characters']
  },
  templateId: {
    type: String, // Can be template ID or custom
    required: [true, 'Template ID is required']
  },
  frameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Frame'
  },
  thumbnailPath: { type: String },
  canvas: {
    backgroundImage: { type: String },
    backgroundColor: { type: String, default: '#ffffff' },
    dimensions: {
      width: { type: Number, default: 800 },
      height: { type: Number, default: 600 }
    }
  },
  elements: {
    type: [elementSchema],
    default: []
  },
  version: {
    type: Number,
    default: 1
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
savedDesignSchema.index({ userId: 1, createdAt: -1 });
savedDesignSchema.index({ userId: 1, name: 1 });
savedDesignSchema.index({ isPublic: 1, createdAt: -1 });
savedDesignSchema.index({ tags: 1 });

// Update lastModified on save
savedDesignSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModified = new Date();
  }
  next();
});

module.exports = mongoose.model('SavedDesign', savedDesignSchema);