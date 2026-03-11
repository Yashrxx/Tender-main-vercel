const express = require('express');
const supabase = require('../supabaseClient');
const router = express.Router();

module.exports = async (req, res) => {
  if (req.method === 'GET' && req.url.endsWith('/')) {
    // Get stats
    const { data: tenders, error: tendersError } = await supabase
      .from('tenders')
      .select('*');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*');
    const { data: applications, error: applicationsError } = await supabase
      .from('applications')
      .select('*');
    const totalTenders = tenders ? tenders.length : 0;
    const openTenders = tenders ? tenders.filter(t => t.status === 'Open').length : 0;
    const totalCompanies = companies ? companies.length : 0;
    const totalApplications = applications ? applications.length : 0;
    return res.json({ totalTenders, openTenders, totalCompanies, totalApplications });
  }
};