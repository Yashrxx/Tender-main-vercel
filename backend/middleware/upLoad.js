const path = require('path');
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase(); // ✅ Get actual file extension
    const valid = allowed.test(ext);
    if (valid) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, or PNG images are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;