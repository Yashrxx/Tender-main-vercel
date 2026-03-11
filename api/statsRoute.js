const supabase = require('../backend/supabaseClient');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { data: tenders, error: tErr } = await supabase.from('tenders').select('*');
      const { data: companies, error: cErr } = await supabase.from('companies').select('*');
      const { data: applications, error: aErr } = await supabase.from('applications').select('*');

      if (tErr || cErr || aErr) {
        return res.status(500).json({ error: 'Failed to fetch stats' });
      }

      return res.status(200).json({
        totalTenders: (tenders || []).length,
        openTenders: (tenders || []).filter(t => t.status === 'Open').length,
        totalCompanies: (companies || []).length,
        totalApplications: (applications || []).length
      });
    }
    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Stats route error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
