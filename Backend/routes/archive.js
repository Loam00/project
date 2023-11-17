const express = require('express');
const archiveControllers = require('../controllers/archive');
const upload = require('../helpers/storage')

const router = express.Router();

router.post('/', upload.single('file'), archiveControllers.storeFile);

router.get('/:type/:id_user', archiveControllers.getFile);

router.delete('/:folder/:id_file', archiveControllers.deleteFile);

module.exports = router;