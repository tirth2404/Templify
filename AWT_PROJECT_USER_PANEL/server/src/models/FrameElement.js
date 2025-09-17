const mongoose = require('mongoose');

const frameElementSchema = new mongoose.Schema({
  frameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Frame',
    required: [true, 'Frame ID is required']
  },
  elementType: {
    type: String,
    required: [true, 'Element type is required'],
    enum: ['name', 'email', 'facebook', 'linkedin', 'twitter', 'instagram', 'mobile', 'address', 'logo', 'website'],
    lowercase: true
  },
  position: {
    x: { type: Number, required: [true, 'X position is required'] },
    y: { type: Number, required: [true, 'Y position is required'] }
  },
  styling: {
    fontSize: { type: Number, default: 16, min: 8, max: 72 },
    fontColor: { type: String, default: '#000000', match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
    fontFamily: { type: String, default: 'Arial' },
    fontWeight: { type: String, enum: ['normal', 'bold', 'lighter'], default: 'normal' },
    textAlign: { type: String, enum: ['left', 'center', 'right'], default: 'left' }
  },
  dimensions: {
    width: { type: Number, min: 10 },
    height: { type: Number, min: 10 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
frameElementSchema.index({ frameId: 1, isActive: 1 });
frameElementSchema.index({ elementType: 1 });

// Validation for logo elements
frameElementSchema.pre('save', function(next) {
  if (this.elementType === 'logo') {
    // Logo elements don't need font styling
    this.styling = {
      fontSize: 0,
      fontColor: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      textAlign: 'center'
    };
  }
  next();
});

module.exports = mongoose.model('FrameElement', frameElementSchema);

// =====================================================
