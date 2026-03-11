const supabase = require('../../backend/supabaseClient');
const url = require('url');

module.exports = async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const { path } = req.query;
    const route = Array.isArray(path) ? path.join('/') : path || '';
    const query = parsedUrl.query;

    // GET /api/companyRoutes?route=allCompanies
    if (req.method === 'GET' && query.route === 'allCompanies') {
      const { data, error } = await supabase.from('companies').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    // GET /api/companyRoutes/companyProfile?email=xxx
    if (req.method === 'GET' && route === 'companyProfile' && query.email) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('email', query.email)
        .single();
      if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
      if (!data) return res.status(404).json({ error: 'Company not found' });
      return res.status(200).json(data);
    }

    // POST /api/companyRoutes/companyProfile/create
    if (req.method === 'POST' && route === 'companyProfile/create') {
      const { name, website, industry, description, address, email, phone } = req.body;
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name, website, industry, description, address, email, phone }])
        .select();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data[0]);
    }

    // PUT /api/companyRoutes/companyProfile/update
    if (req.method === 'PUT' && route === 'companyProfile/update') {
      const { name, website, industry, description, address, email, phone } = req.body;
      const { data, error } = await supabase
        .from('companies')
        .update({ name, website, industry, description, address, phone })
        .eq('email', email)
        .select();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data[0]);
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Company route error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
