const mongoose = require('mongoose');

const SocialLinksSchema = new mongoose.Schema({
  website: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  twitter: { type: String, default: '' }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  socialLinks: { type: SocialLinksSchema, default: () => ({}) }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);


