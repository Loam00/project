const { validationResult } = require('express-validator');

const Movements = require('../Models/Movements');

exports.addMovement = async (req, res) => {

    const result = validationResult(req);
    if( !result.isEmpty() ) res.status(201).json({ message: result.errors[0].msg });
    
    if (!result.isEmpty()) return

    const id_user = req.body.id_user;
    const object = req.body.object;
    const amount = req.body.amount;

    try {
        const movement = {
            id_user: id_user,
            object: object,
            amount: amount
        }
        
        const result = await Movements.addMovement(movement);

        res.status(201).json({ message: 'Posted!'})

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }      
    }
}

exports.fetchMovements = async (req, res) => {
    try {
        const user = req.params.id_user;
        const allMovements = await Movements.fetchMovements(user); 
        res.status(200).json(allMovements);       
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }       
    }
}

exports.deleteMovements = async (req, res) => {
    try {           
        const id = req.params.id_movement;
        const deleteResponse = await Movements.deleteMovements(id);
        res.status(200).json(deleteResponse);
        res.status(201).json( {message: "Deleted"});     
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }      
    }      
}

exports.editMovements = async (req, res) => {
    
    const id_movement = req.body.id_movement;
    const object = req.body.object;
    const amount = req.body.amount;

    const movement = {
        object: object,
        amount: amount,
        id_movement: id_movement
    }
    
    try {           
        
        console.log(movement)

        const editResponse = await Movements.editMovements(movement);
        res.status(200).json(editResponse, {message: "Edited"});  
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }      
    }      
}