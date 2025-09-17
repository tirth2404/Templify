const mongoose = require('mongoose');

const masterCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('MasterCategory', masterCategorySchema);
