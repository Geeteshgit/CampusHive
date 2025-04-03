const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
      const randomName = crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
      cb(null, randomName);
    }
  })
  
const upload = multer({ storage: storage });

const uploadLimit = multer({
    storage,
    limits : {fileSize : 5 * 1024 * 1024},
    fileFilter : (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG and PNG allowed.'));
        }
        }
});

module.exports = { upload, uploadLimit }