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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, auth-token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Missing Supabase credentials' });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const route = req.query.route;
    const email = req.query.email;

    // GET /api/companies?route=allCompanies
    if (req.method === 'GET' && route === 'allCompanies') {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(companies || []);
    }

    // GET /api/companies?email=X — get company by email
    if (req.method === 'GET' && email) {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('email', email)
        .single();
      if (error || !company) return res.status(404).json({ error: 'Company not found' });
      return res.status(200).json(company);
    }

    // POST /api/companies — create company profile
    if (req.method === 'POST') {
      const user = getUser(req);
      if (!user) return res.status(401).json({ error: 'Access denied: no valid token' });

      const { name, website, industry, description, address, phone } = req.body;

      // Check if company already exists for this user
      const { data: existing } = await supabase
        .from('companies')
        .select('*')
        .eq('email', user.email)
        .single();
      if (existing) {
        return res.status(400).json({ error: 'Company profile already exists' });
      }

      const { data: newCompany, error: createError } = await supabase
        .from('companies')
        .insert([{
          user_id: user.id,
          email: user.email,
          name, website, industry, description, address, phone
        }])
        .select();
      if (createError) return res.status(500).json({ error: createError.message });

      return res.status(201).json({ message: 'Company profile created', company: newCompany });
    }

    // PUT /api/companies — update company profile
    if (req.method === 'PUT') {
      const user = getUser(req);
      if (!user) return res.status(401).json({ error: 'Access denied: no valid token' });

      const { name, website, industry, description, address, phone } = req.body;

      const { data: company, error: findError } = await supabase
        .from('companies')
        .select('*')
        .eq('email', user.email)
        .single();
      if (!company) return res.status(404).json({ error: 'Company not found' });

      const { data: updated, error: updateError } = await supabase
        .from('companies')
        .update({ name, website, industry, description, address, phone })
        .eq('id', company.id)
        .select();
      if (updateError) return res.status(500).json({ error: updateError.message });

      return res.status(200).json({ message: 'Company profile updated', company: updated });
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Companies error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
