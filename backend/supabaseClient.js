try { require('dotenv').config(); } catch (e) {}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials missing. SUPABASE_URL:", !!supabaseUrl, "SUPABASE_SERVICE_ROLE_KEY:", !!supabaseKey);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;