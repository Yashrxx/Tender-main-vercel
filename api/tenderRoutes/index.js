const supabase = require('../../backend/supabaseClient');
const url = require('url');

module.exports = async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    if (req.method === 'GET' && query.route === 'allTenders') {
      const { data, error } = await supabase.from('tenders').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === 'GET' && query.route === 'companyTenders' && query.companyId) {
      const { data, error } = await supabase.from('tenders').select('*').eq('company_id', query.companyId);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === 'GET' && query.id) {
      const { data, error } = await supabase.from('tenders').select('*').eq('id', query.id).single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { title, description, deadline, budget, location, category, company_id } = req.body;
      const { data, error } = await supabase
        .from('tenders')
        .insert([{ title, description, deadline, budget, location, category, company_id }])
        .select();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data[0]);
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Tender route error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
