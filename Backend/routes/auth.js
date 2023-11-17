const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../Models/User')

const authController = require('../controllers/auth')

router.post(
    '/register', 
    [
        body('email').isEmail().withMessage('Please enter a valid email')
        .custom(
            async (givenEmail) => {                
                let user = await User.check(givenEmail);                

                if( user == givenEmail)
                {
                    return Promise.reject('Email already exists')
                }
            }
        )     
        .normalizeEmail(),
        body('name').trim().not().isEmpty(),
        body('password').trim().isLength({ min: 8 })
    ], authController.register
)

router.post('/login', authController.login)

module.exports = router;