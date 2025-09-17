// Placeholder template/category controller to fetch from admin panel later or own collection
const axiosLikeFetch = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed');
  return res.json();
};

exports.all = async (req, res) => {
  try {
    // Example: proxy to admin panel endpoint if needed
    // const data = await axiosLikeFetch(process.env.ADMIN_API_BASE + '/api/template/all');
    return res.json({ success: true, templates: [] });
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.categories = async (req, res) => {
  try {
    return res.json({ success: true, categories: [] });
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


