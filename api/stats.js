const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Missing Supabase credentials' });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [tendersRes, companiesRes, applicationsRes] = await Promise.all([
      supabase.from('tenders').select('id, status'),
      supabase.from('companies').select('id'),
      supabase.from('applications').select('id')
    ]);

    const tenders = tendersRes.data || [];
    const companies = companiesRes.data || [];
    const applications = applicationsRes.data || [];

    return res.status(200).json({
      totalTenders: tenders.length,
      openTenders: tenders.filter(t => t.status === 'Open').length,
      totalCompanies: companies.length,
      totalApplications: applications.length
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
