const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const auth = require('../middleware/auth')

const movementsController = require('../controllers/movements')

router.post(
    '/',
    [
        /* auth, */
        body('id_user').trim().not().isEmpty(),
        body('object').trim().isLength( { min: 5} ).not().isEmpty(),
        body('amount').trim().isLength( { min: 0} ).not().isEmpty()        
    ], movementsController.addMovement
);

router.get('/:id_user', movementsController.fetchMovements);

router.delete('/:id_movement', movementsController.deleteMovements);

router.put('/:id_movement', movementsController.editMovements)

module.exports = router;