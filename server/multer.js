const multer = require('multer');

// Define storage strategy for multer
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep original file name
  },
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

module.exports = upload;