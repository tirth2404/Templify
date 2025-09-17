const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { jwt: jwtCfg } = require('../utils/constants');

function sign(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: jwtCfg.expiresIn });
}

exports.signup = async (req, res) => {
  try {
    const { companyName, email, password, mobile, address, socialLinks = {} } = req.body;
    if (!companyName || !email || !password || !mobile || !address) return res.status(400).json({ success: false, message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ companyName, email, passwordHash, mobile, address, socialLinks });
    return res.json({ success: true, message: 'Signup successful' });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = sign(user);
    return res.json({ success: true, token, user: {
      id: user._id, companyName: user.companyName, email: user.email, mobile: user.mobile, address: user.address, socialLinks: user.socialLinks
    }});
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'Not found' });
  return res.json({ success: true, user });
};

exports.updateMe = async (req, res) => {
  try {
    const update = (({ companyName, email, mobile, address, socialLinks }) => ({ companyName, email, mobile, address, socialLinks }))(req.body);
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });
    return res.json({ success: true, user });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ success: false, message: 'Current password incorrect' });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ success: true, message: 'Password updated' });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


