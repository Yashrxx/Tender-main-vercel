const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../../backend/supabaseClient');

const JWT_SECRET = process.env.JWT_SECRET || 'yash@isarockstar';

module.exports = async (req, res) => {
  try {
    const { path } = req.query;
    const route = Array.isArray(path) ? path.join('/') : path;

    // Signup route: /api/auth/createuser
    if (req.method === 'POST' && route === 'createuser') {
      const { name, email, phone, password } = req.body;
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ name, email, phone, password: secPass }])
        .select();
      if (createError) {
        return res.status(500).json({ success: false, error: createError.message });
      }
      const payload = { user: { id: newUser[0].id, name: newUser[0].name, email: newUser[0].email } };
      const authToken = jwt.sign(payload, JWT_SECRET);
      return res.status(201).json({ success: true, authToken, user: payload.user });
    }

    // Login route: /api/auth/login
    if (req.method === 'POST' && route === 'login') {
      const { email, password } = req.body;
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      if (error || !user) {
        return res.status(400).json({ success: false, error: 'Invalid credentials' });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ success: false, error: 'Invalid credentials' });
      }
      const payload = { user: { id: user.id, name: user.name, email: user.email } };
      const authToken = jwt.sign(payload, JWT_SECRET);
      return res.status(200).json({ success: true, authToken, user: payload.user });
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
