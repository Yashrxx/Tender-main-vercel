const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const JWT_SECRET = (process.env.JWT_SECRET || '').trim();
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
    const route = req.query.route;
    const id = req.query.id;

    // GET /api/tenders?route=allTenders
    if (req.method === 'GET' && route === 'allTenders') {
      const { data: tenders, error } = await supabase
        .from('tenders')
        .select('*, company:companies(name, phone)')
        .order('created_at', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(tenders || []);
    }

    // GET /api/tenders?route=companyTenders&companyId=X
    if (req.method === 'GET' && route === 'companyTenders') {
      const companyId = req.query.companyId;
      if (!companyId) return res.status(400).json({ error: 'companyId is required' });
      const { data: tenders, error } = await supabase
        .from('tenders')
        .select('*, company:companies(name, phone)')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(tenders || []);
    }

    // GET /api/tenders?id=X — single tender by ID
    if (req.method === 'GET' && id) {
      const { data: tender, error } = await supabase
        .from('tenders')
        .select('*, company:companies(name, phone)')
        .eq('id', id)
        .single();
      if (error || !tender) return res.status(404).json({ error: 'Tender not found' });
      return res.status(200).json(tender);
    }

    // POST /api/tenders?route=application — create/publish a new tender
    if (req.method === 'POST' && route === 'application') {
      const user = getUser(req);
      if (!user) return res.status(401).json({ error: 'Access denied: no valid token' });

      const { title, description, deadline, budget, category, location } = req.body;
      if (!title || !description || !deadline || !budget) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Get company by user email
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('email', user.email)
        .single();
      if (!company) return res.status(404).json({ error: 'Company not found. Create a company profile first.' });

      const { data: newTender, error: tenderError } = await supabase
        .from('tenders')
        .insert([{
          title, description, deadline, budget, category, location,
          status: 'Open',
          user_id: user.id,
          company_id: company.id
        }])
        .select();
      if (tenderError) return res.status(500).json({ error: tenderError.message });

      return res.status(201).json({ message: 'Tender published successfully', tender: newTender });
    }    // GET /api/tenders?route=myTenders — get tenders filed by the logged-in user's company
    if (req.method === 'GET' && route === 'myTenders') {
      const user = getUser(req);
      if (!user) return res.status(401).json({ error: 'Access denied: no valid token' });

      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();
      if (!company) return res.status(200).json([]);

      const { data: tenders, error } = await supabase
        .from('tenders')
        .select('*, company:companies(name, phone)')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(tenders || []);
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Tenders error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
