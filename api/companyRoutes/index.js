const supabase = require('../../backend/supabaseClient');
const url = require('url');

module.exports = async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    // GET /api/companyRoutes?route=allCompanies
    if (req.method === 'GET' && query.route === 'allCompanies') {
      const { data, error } = await supabase.from('companies').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Company route error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
