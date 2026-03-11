const supabase = require('../backend/supabaseClient');

module.exports = async (req, res) => {
  try {
    // POST /api/applications — submit an application
    if (req.method === 'POST') {
      const { tenderId, message } = req.body;
      const token = req.headers['auth-token'];
      let userId = null;
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const JWT_SECRET = process.env.JWT_SECRET || 'yash@isarockstar';
          const decoded = jwt.verify(token, JWT_SECRET);
          userId = decoded.user?.id;
        } catch (e) {
          return res.status(401).json({ error: 'Invalid token' });
        }
      }

      const { data, error } = await supabase
        .from('applications')
        .insert([{ tender_id: tenderId, user_id: userId, message }])
        .select();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data[0]);
    }

    // GET /api/applications
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('applications').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Application route error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
