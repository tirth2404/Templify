const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  master_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterCategory', required: true }
});

module.exports = mongoose.model('Category', CategorySchema);
