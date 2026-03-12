const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const supabase = require('../supabaseClient');

const JWT_SECRET = process.env.JWT_SECRET || '';

// === Middleware to fetch logged-in user ===
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ error: 'Access Denied: No Token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid Token' });
  }
};

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST' && req.url.endsWith('/createuser')) {
      const { name, email, phone, password } = req.body;
      const { data: existingUser, error: userError } = await supabase
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
        .insert([{ name, email, phone, password: secPass }]);
      if (createError) {
        return res.status(500).json({ success: false, error: createError.message });
      }
      return res.status(201).json({ success: true, user: newUser });
    }
    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
