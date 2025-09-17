const mongoose = require('mongoose');

const ElementSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'image'], required: true },
  content: String,
  src: String,
  x: Number,
  y: Number,
  fontSize: Number,
  fontFamily: String,
  color: String,
  fontWeight: String,
  width: Number,
  height: Number
}, { _id: false });

const SavedDesignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  templateId: { type: String, required: true },
  thumbnail: String,
  backgroundImage: String,
  backgroundColor: { type: String, default: '#ffffff' },
  elements: { type: [ElementSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('SavedDesign', SavedDesignSchema);


