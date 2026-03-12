// Seed script for Supabase - run with: node seed-supabase.js
// This inserts sample tenders directly into Supabase tables

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cjpxhitihjewloswivcg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcHhoaXRpaGpld2xvc3dpdmNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzE5MDgzNSwiZXhwIjoyMDg4NzY2ODM1fQ.WetWTYz0hC79QEea2JhJdtaA6q1Hm66VG4rTLDCTWBI';

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  "Construction & Civil Works",
  "Information Technology (IT)",
  "Electrical Equipment & Works",
  "Healthcare & Medical Equipment",
  "Roads & Bridges",
  "Education & Training",
  "Consultancy Services",
  "Agriculture & Allied Services",
  "Transportation & Logistics",
  "Telecommunications",
  "Security Services",
  "Water Supply & Sanitation",
  "Office Equipment & Stationery",
  "Environmental Services",
  "Machinery & Industrial Supplies"
];

const locations = [
  "Delhi", "Maharashtra", "Tamil Nadu", "Karnataka", "Gujarat",
  "Rajasthan", "Uttar Pradesh", "West Bengal", "Kerala", "Punjab"
];

const sampleTenders = [
  { title: "IT Infrastructure Upgrade for Government Office", description: "Complete upgrade of IT infrastructure including servers, networking equipment, and workstations for the district government office. Includes installation and configuration.", budget: 250000 },
  { title: "Road Construction - NH 48 Extension", description: "Construction of 12km road extension on National Highway 48 including drainage systems, signage, and lane markings.", budget: 450000 },
  { title: "Hospital Equipment Supply", description: "Supply and installation of medical equipment including MRI machine, X-ray units, and ICU monitoring systems for the district hospital.", budget: 380000 },
  { title: "School Building Renovation", description: "Complete renovation of primary school building including structural repairs, painting, electrical work, and plumbing upgrades.", budget: 120000 },
  { title: "Water Treatment Plant Setup", description: "Design, construction and commissioning of a water treatment plant with capacity of 5 MLD for the municipal corporation.", budget: 500000 },
  { title: "Solar Panel Installation - Govt Buildings", description: "Installation of rooftop solar panels on 15 government buildings with total capacity of 500kW including inverters and metering.", budget: 320000 },
  { title: "Security System for Public Library", description: "Installation of CCTV cameras, access control systems, and fire alarm systems for the central public library.", budget: 85000 },
  { title: "Agricultural Equipment Procurement", description: "Procurement of modern agricultural equipment including tractors, harvesters, and irrigation pumps for farmer cooperatives.", budget: 275000 },
  { title: "Telecom Tower Installation", description: "Installation of 5 telecom towers in rural areas to improve mobile connectivity coverage in underserved regions.", budget: 400000 },
  { title: "Office Furniture Supply", description: "Supply of modular office furniture including desks, chairs, and storage units for the new administrative building.", budget: 95000 },
  { title: "Bridge Repair - River Crossing", description: "Structural repair and reinforcement of the 200m bridge over the river including expansion joints and railing replacement.", budget: 350000 },
  { title: "Environmental Impact Assessment", description: "Comprehensive environmental impact assessment for the proposed industrial zone expansion project.", budget: 150000 },
  { title: "Electrical Wiring for Housing Complex", description: "Complete electrical wiring and fitting installation for 200-unit government housing complex including common areas.", budget: 180000 },
  { title: "Transport Fleet Management System", description: "Development and deployment of GPS-based fleet management system for the municipal transport corporation.", budget: 220000 },
  { title: "Consultancy for Smart City Project", description: "Technical consultancy services for smart city initiatives including IoT infrastructure planning and implementation roadmap.", budget: 300000 },
];

async function seed() {
  try {
    // Get existing users and companies
    const { data: users } = await supabase.from('users').select('id');
    const { data: companies } = await supabase.from('companies').select('id');

    if (!users || users.length === 0) {
      console.log('No users found. Creating a test user first...');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash('password123', salt);
      
      const { data: newUser, error } = await supabase.from('users')
        .insert([{ name: 'Test User', email: 'testuser@tender.com', phone: '9876543210', password: hashedPass }])
        .select();
      if (error) { console.error('Failed to create user:', error); return; }
      users.push(newUser[0]);
    }

    if (!companies || companies.length === 0) {
      console.log('No companies found. Creating a test company first...');
      const { data: newCompany, error } = await supabase.from('companies')
        .insert([{ user_id: users[0].id, name: 'Test Company', email: 'testcompany@tender.com', industry: 'Information Technology (IT)', phone: '9876543210' }])
        .select();
      if (error) { console.error('Failed to create company:', error); return; }
      companies.push(newCompany[0]);
    }

    console.log(`Found ${users.length} users and ${companies.length} companies`);

    // Insert tenders
    const tenders = sampleTenders.map((t, i) => ({
      ...t,
      category: categories[i % categories.length],
      location: locations[i % locations.length],
      status: 'Open',
      deadline: new Date(Date.now() + (7 + i * 3) * 24 * 60 * 60 * 1000).toISOString(), // 7-52 days from now
      user_id: users[i % users.length].id,
      company_id: companies[i % companies.length].id,
    }));

    const { data, error } = await supabase.from('tenders').insert(tenders).select();
    
    if (error) {
      console.error('Failed to insert tenders:', error);
      return;
    }

    console.log(`✅ Successfully seeded ${data.length} tenders!`);
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

seed();
