const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../../backend/supabaseClient');

const JWT_SECRET = process.env.JWT_SECRET || 'yash@isarockstar';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
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
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
