const multer = require('multer');

const multer = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "../upload")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round.apply(Math.random() * 1e9);
        const filename = file.originalname.split(".",)[0]
        cb(null, filename + "_" + uniqueSuffix + ".png")
    }

})

module.exports = upload = multer({storage: storage})