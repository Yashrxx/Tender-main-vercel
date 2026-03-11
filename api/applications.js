const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const JWT_SECRET = (process.env.JWT_SECRET || 'yash@isarockstar').trim();
const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

function getUser(req) {
  const token = req.headers['auth-token'];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.user;
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, auth-token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Missing Supabase credentials' });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // POST /api/applications — submit an application
    if (req.method === 'POST') {
      const user = getUser(req);
      if (!user) return res.status(401).json({ error: 'Access denied: no valid token' });

      const { tenderId, message } = req.body;
      if (!tenderId) return res.status(400).json({ error: 'tenderId is required' });

      // Get company by user email
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('email', user.email)
        .single();
      if (!company) return res.status(404).json({ error: 'Company not found. Create a company profile first.' });

      // Check tender exists
      const { data: tender, error: tenderError } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', tenderId)
        .single();
      if (!tender) return res.status(404).json({ error: 'Tender not found' });

      // Create application
      const { data: newApp, error: appError } = await supabase
        .from('applications')
        .insert([{ tender_id: tenderId, company_id: company.id, message }])
        .select();
      if (appError) return res.status(500).json({ error: appError.message });

      return res.status(201).json({ application: newApp });
    }

    // GET /api/applications?tenderId=X — get applications for a tender
    if (req.method === 'GET') {
      const tenderId = req.query.tenderId;
      if (!tenderId) return res.status(400).json({ error: 'tenderId is required' });

      const { data: apps, error } = await supabase
        .from('applications')
        .select('*, company:companies(*)')
        .eq('tender_id', tenderId);
      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(apps || []);
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Applications error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
