const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Sequelize DB connection
const sequelize = require('./db');  // <- keep this
require('./models/Index');                    // ✅ this registers all models & associations

// ✅ Sync models
sequelize.sync({ alter: true })
  .then(() => console.log("✅ PostgreSQL DB synced with Sequelize"))
  .catch(err => console.error("❌ Sequelize sync error:", err));

// ✅ Create 'uploads' folder if it doesn't exist
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log("'uploads/' folder created.");
}

// ✅ ROUTES
const tenderRoutes = require('./routes/tenderRoutes');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companyRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const statsRoutes = require('./routes/statsRoute');

// ✅ CORS config
const allowedOrigins = [
  "http://localhost:3001",
  "https://yashrxx.github.io",
  "https://tender-56x1.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/companyRoutes', companyRoutes); // multipart/form-data
app.use('/api/tenderRoutes', tenderRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);

// ✅ Root
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Tender-client Backend is Live!" });
});

// ✅ 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Tender-client backend listening on port ${port}`);
});