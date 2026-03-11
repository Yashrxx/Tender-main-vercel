const supabase = require('../backend/supabaseClient');
const url = require('url');

module.exports = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const route = parsedUrl.query.route;

  if (req.method === 'GET' && route === 'stats') {
    const { data, error } = await supabase.rpc('get_stats'); // Example: use Supabase function
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'GET') {
    const { data: tenders } = await supabase.from('tenders').select('*');
    const { data: companies } = await supabase.from('companies').select('*');
    const { data: applications } = await supabase.from('applications').select('*');
    return res.status(200).json({
      totalTenders: tenders.length,
      openTenders: tenders.filter(t => t.status === 'Open').length,
      totalCompanies: companies.length,
      totalApplications: applications.length
    });
  }
  return res.status(404).json({ error: 'Route not found' });
};
