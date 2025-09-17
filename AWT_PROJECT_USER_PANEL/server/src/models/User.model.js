const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
  website: String,
  facebook: String,
  instagram: String,
  twitter: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  socialLinks: { type: SocialSchema, default: () => ({}) }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);


