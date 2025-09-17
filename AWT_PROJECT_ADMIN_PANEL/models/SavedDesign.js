const mongoose = require('mongoose');

const ElementSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'image'], required: true },
  content: { type: String },
  src: { type: String },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  fontSize: { type: Number },
  fontFamily: { type: String },
  color: { type: String },
  fontWeight: { type: String },
  width: { type: Number },
  height: { type: Number }
}, { _id: false });

const SavedDesignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  templateId: { type: String, required: true },
  thumbnail: { type: String },
  backgroundImage: { type: String },
  backgroundColor: { type: String, default: '#ffffff' },
  elements: { type: [ElementSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('SavedDesign', SavedDesignSchema);


