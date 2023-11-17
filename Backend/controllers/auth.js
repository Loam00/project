const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
/* const jwt = require('jsonwebtoken'); */

const User = require('../Models/User');

exports.register = async (req, res) => {
    
    const result = validationResult(req);
    console.log(result);
    if( !result.isEmpty() ) res.status(201).json({ message: result.errors[0].msg });

    if (!result.isEmpty()) return
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const userDetails = {
            email: email,
            name: name,            
            password: hashedPassword
        }

        const result = await User.save(userDetails);
        
        res.status(201).json({ message: 'User registered'});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        let user = await User.find(email);

        if (user.row == undefined) {
            const error = new Error('A user with this email could not be found.')
            error.statusCode = 401;
            throw error;
        }

        const storedUser = user.row;

        const isEqual = await bcrypt.compare(password, storedUser.password);

        if (!isEqual) {
            const error = new Error('Wrong password!')
            error.statusCode = 401;
            throw error;
        }
       
        res.status(200).json({ userId: storedUser.id_user });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
    
}