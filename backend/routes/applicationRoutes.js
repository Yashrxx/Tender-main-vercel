const express = require('express');
const router = express.Router();

const fetchUser = require('../middleware/fetchUser');
const supabase = require('../supabaseClient');

module.exports = async (req, res) => {
  if (req.method === 'POST' && req.url.endsWith('/')) {
    const { tenderId, message } = req.body;
    const userId = req.user.id;
    // Get company by user_id
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (!company) return res.status(404).json({ error: 'Company not found' });
    // Check tender exists
    const { data: tenderExists, error: tenderError } = await supabase
      .from('tenders')
      .select('*')
      .eq('id', tenderId)
      .single();
    if (!tenderExists) return res.status(404).json({ error: 'Tender not found' });
    // Create application
    const { data: newApp, error: appError } = await supabase
      .from('applications')
      .insert([{ tender_id: tenderId, company_id: company.id, message }]);
    if (appError) return res.status(500).json({ error: appError.message });
    return res.status(201).json({ application: newApp });
  }
  // ...other routes to be migrated similarly...
};

router.get('/byTender/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const apps = await Application.findAll({
      where: { tender_id: tenderId },
      include: [{ model: Company }]
    });

    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

module.exports = router;