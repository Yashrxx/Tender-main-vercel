const supabase = require('../backend/supabaseClient');

module.exports = async (req, res) => {
  // Example: fetch all tenders
  if (req.method === 'GET' && req.url.endsWith('/allTenders')) {
    const { data, error } = await supabase.from('tenders').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }
  return res.status(404).json({ error: 'Route not found' });
};
