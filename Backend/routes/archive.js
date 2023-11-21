const express = require('express');
const archiveControllers = require('../controllers/archive');
const upload = require('../helpers/storage')

const router = express.Router();

router.post('/', upload.single('file'), archiveControllers.storeFile);

router.get('/:id_file', archiveControllers.getFile);

router.get('/fileObject/:type/:id_user', archiveControllers.getFileObject)

router.delete('/:folder/:id_file', archiveControllers.deleteFile);

module.exports = router;