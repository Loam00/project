const multer = require('multer')

const diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const type = file.mimetype.split("/");
        if(type[0] == "image") {
            cb(null, 'images');            
        }
        if(type[0] == "application") {
            cb(null, 'documents');            
        }
        if(type[0] == "audio") {
            cb(null, 'music');            
        }
    },

    // By default multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        const typeFile = file.originalname.split(".");
        const fileName = req.body.name + "." + typeFile[typeFile.length - 1];
        console.log(typeFile, " / ", fileName);
        cb(null, fileName);
    }
});

const upload = multer({ storage: diskStorage });

module.exports = upload;
