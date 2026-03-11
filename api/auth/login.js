const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../../backend/supabaseClient');

const JWT_SECRET = process.env.JWT_SECRET || 'yash@isarockstar';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
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
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
