const SavedDesign = require('../models/SavedDesign.model');

exports.create = async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const created = await SavedDesign.create(payload);
    return res.json({ success: true, design: created });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const designs = await SavedDesign.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, designs });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await SavedDesign.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Design not found' });
    return res.json({ success: true, design: updated });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const removed = await SavedDesign.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!removed) return res.status(404).json({ success: false, message: 'Design not found' });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


