const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const JWT_SECRET = (process.env.JWT_SECRET || 'yash@isarockstar').trim();
const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, auth-token');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Missing Supabase credentials' });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const route = req.query.route;

    if (route === 'createuser') {
      const { name, email, phone, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
      const { data: newUser, error: createError } = await supabase.from('users').insert([{ name, email, phone, password: secPass }]).select();
      if (createError) {
        return res.status(500).json({ success: false, error: createError.message || 'Insert failed' });
      }
      if (!newUser || newUser.length === 0) {
        return res.status(500).json({ success: false, error: 'Insert returned no data' });
      }
      const payload = { user: { id: newUser[0].id, name: newUser[0].name, email: newUser[0].email } };
      const authToken = jwt.sign(payload, JWT_SECRET);
      return res.status(201).json({ success: true, authtoken: authToken, user: payload.user });
    }

    if (route === 'login') {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      const { data: user, error: userError } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
      if (userError || !user) {
        return res.status(400).json({ success: false, error: 'Invalid credentials' });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ success: false, error: 'Invalid credentials' });
      }
      const payload = { user: { id: user.id, name: user.name, email: user.email } };
      const authToken = jwt.sign(payload, JWT_SECRET);
      return res.status(200).json({ success: true, authtoken: authToken, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
