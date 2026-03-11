// middleware/fetchCompany.js
const pool = require('../db'); // This is your PostgreSQL client connection

const fetchCompany = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    const result = await pool.query(
      'SELECT * FROM companies WHERE user_id = $1 LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    req.company = result.rows[0];
    next();
  } catch (err) {
    console.error("Error in fetchCompany middleware:", err);
    res.status(500).json({ error: "Server error while fetching company" });
  }
};

module.exports = fetchCompany;