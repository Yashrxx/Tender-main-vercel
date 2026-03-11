const supabase = require('../backend/supabaseClient');
const url = require('url');

module.exports = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const route = parsedUrl.query.route;
  const companyId = parsedUrl.query.companyId;

  if (req.method === 'GET' && route === 'companyTenders' && companyId) {
    const { data, error } = await supabase.from('tenders').select('*').eq('company_id', companyId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'GET' && route === 'allTenders') {
    const { data, error } = await supabase.from('tenders').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }
  return res.status(404).json({ error: 'Route not found' });
};
