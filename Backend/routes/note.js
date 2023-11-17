const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const auth = require('../middleware/auth')

const noteController = require('../controllers/note')

router.post(
    '/',
    [
        /* auth, */
        body('id_user').trim().not().isEmpty(),
        body('title').trim().isLength( { min: 5} ).not().isEmpty(),
        body('text').trim().isLength( { min: 0} ).not().isEmpty()        
    ], noteController.createNote
);

router.get('/:id_user', noteController.fetchNotes);

router.delete('/:id_notes', noteController.deleteNotes);

router.put('/:id_notes', noteController.editNotes)

module.exports = router;