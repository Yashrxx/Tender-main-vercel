const supabase = require('../backend/supabaseClient');

module.exports = async (req, res) => {
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
