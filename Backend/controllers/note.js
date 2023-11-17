const { validationResult } = require('express-validator');

const Note = require('../Models/Note');

exports.createNote = async (req, res) => {

    const result = validationResult(req);
    if( !result.isEmpty() ) res.status(201).json({ message: result.errors[0].msg });
    
    if (!result.isEmpty()) return

    const id_user = req.body.id_user;
    const title = req.body.title;
    const text = req.body.text;

    try {
        const note = {
            id_user: id_user,
            title: title,
            text: text
        }

        console.log(note)
        
        const result = await Note.createNote(note);

        res.status(201).json({ message: 'Posted!'})

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }      
    }
}

exports.fetchNotes = async (req, res) => {
    try {
        const user = req.params.id_user;
        const allNotes = await Note.fetchNotes(user); 
        res.status(200).json(allNotes);       
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }       
    }
}

exports.deleteNotes = async (req, res) => {
    try {           
        const id = req.params.id_notes;
        const deleteResponse = await Note.deleteNotes(id);
        res.status(200).json(deleteResponse);
        res.status(201).json( {message: "Deleted"});     
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }      
    }      
}

exports.editNotes = async (req, res) => {
    
    const id_notes = req.body.id_notes;
    const title = req.body.title;
    const text = req.body.text;

    const note = {
        title: title,
        text: text,
        id_notes: id_notes
    }
    
    try {           
        
        console.log(note)

        const editResponse = await Note.editNotes(note);
        res.status(200).json(editResponse);
        res.status(201).json( {message: "Edited"});     
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }      
    }      
}