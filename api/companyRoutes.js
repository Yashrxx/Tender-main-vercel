const path = require('path');
const supabase = require('../backend/supabaseClient');
const url = require('url');

const uploadToSupabase = async (file, folder = 'logos') => {
  if (!file) return null;
  const buffer = file.buffer;
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;
  const { data, error } = await supabase.storage
    .from('company-logos')
    .upload(fileName, buffer, {
      contentType: file.mimetype,
      upsert: true
    });
  if (error) throw error;
  return supabase.storage.from('company-logos').getPublicUrl(fileName).data.publicUrl;
};

module.exports = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const route = parsedUrl.query.route;

  if (req.method === 'GET' && route === 'allCompanies') {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // Implement company profile creation, update, fetch, etc. as needed
  // Example: create profile
  if (req.method === 'POST' && req.url.endsWith('/companyProfile/create')) {
    // ...existing logic...
    return res.status(201).json({ success: true });
  }
  return res.status(404).json({ error: 'Route not found' });
};
