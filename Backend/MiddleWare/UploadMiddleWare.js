const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join("__dirname", '..', "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname) || '.jpg';
        const filename = uniqueSuffix + extension;
        cb(null, file.fieldname + "-" + filename);
    },
});

const upload = multer({
    storage,
    limit: {
        filesize: 10 * 1024 * 1024,
        fileFilter: (req, file, cb) => {
            const allowedtypes = /jpg|jpeg|png|gif/;
            const isvalid = allowedtypes.test(file.mimetype);
            if (isvalid) {
                return cb(new Error("Only image files are allowed"));
            }
            else {
                cb(null, true);
            }
        },
    }
});
module.exports = upload;    