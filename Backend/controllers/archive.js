const { validationResult, header } = require('express-validator');
const Archive = require('../Models/Archive');
const fs = require('fs')

exports.storeFile = async (req, res) => {

    const result = validationResult(req);
    if( !result.isEmpty() ) res.status(201).json({ message: result.errors[0].msg });
    
    if (!result.isEmpty()) return

    console.log(req.file);

    const id_user = req.body.id_user;
    const extension = req.file.filename.split(".")
    const name = req.body.name + "." + extension[1];
    const type = req.file.mimetype.split("/");
    if(type[0] == "image") {
        pathFinder = "images";
    } else if (type[0] == "application") {
        pathFinder = "documents";        
    } else if (type[0] == "audio") {
        pathFinder = "music";        
    } else if (type[0] == "video") {
        pathFinder = "video";        
    }
    const path = `${pathFinder}/` + req.file.filename;


    try {
        const fileData = {
            id_user: id_user,
            name: name,
            path: path,
            type: type[0]
        }
        
        const result = await Archive.addFile(fileData);

        res.status(201).json({ message: 'Posted!'})

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }      
    }
};

exports.getFile = async (req, res) => {
    try {
        const id_file = req.params.id_file;
        const [allFiles] = await Archive.getFile(id_file);

        res.status(200).sendFile(`C:/Users/Stefano/Documents/GitHub/project/Backend/${allFiles.path}`);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }       
    }
};

exports.getFileObject = async (req, res) => {
    try {
        const user = req.params.id_user;
        const type = req.params.type;
        const allFiles = await Archive.getFileObject(user, type);  
        res.status(200).json(allFiles);              
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }             
    }
}

exports.deleteFile = async (req, res) => {
    try {
        const id_file = req.params.id_file;
        const folder = req.params.folder;

        const [getPath] = await Archive.getPathFromId(id_file);
        fileName = getPath.path.split("/");

        const deleteFile = await fs.unlink(`C:/Users/Stefano/Documents/GitHub/project/Backend/${folder}/${fileName[1]}`, (err) => {
            if(err) throw err;
        });

        const deleteResponse = await Archive.deleteFile(id_file);
        res.status(200).json(deleteResponse);
        res.status(201).json( {message: "Deleted"});         
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }            
    }
};
