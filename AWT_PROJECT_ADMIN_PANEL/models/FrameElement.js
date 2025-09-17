const mongoose = require('mongoose');

const FrameElementSchema = new mongoose.Schema({
  frame_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Frame', 
    required: true 
  },
  element_type: { 
    type: String, 
    required: true,
    enum: ['name', 'email', 'facebook', 'linkedin', 'twitter', 'instagram', 'mobile', 'address', 'logo']
  },
  pos_x: { 
    type: Number, 
    required: true 
  },
  pos_y: { 
    type: Number, 
    required: true 
  },
  font_size: { 
    type: Number, 
    default: 0 
  },
  font_color: { 
    type: String, 
    default: '#000000' 
  }
});

module.exports = mongoose.model('FrameElement', FrameElementSchema);
