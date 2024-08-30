const multer = require('multer');
const path = require('path');

// Multer config
module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads');
        },
        filename: (req, file, cb) => {
            cb(null, `file-${Date.now()}-${file.originalname}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.pdf') {
            return cb(new Error('File type is not supported'), false);
        }
        cb(null, true);
    },
});
