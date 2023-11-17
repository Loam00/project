const sqlite3 = require('sqlite3').verbose();

module.exports = class Archive {

    static async addFile(fileData) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Desktop/Programmi/NewProject/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // INSERT DATA INTO DATABASE        
        const create = await new Promise( resolve => {

            let sql = "INSERT INTO files (id_user, name, path, type) VALUES (?, ?, ?, ?)"

            db.run(sql, [fileData.id_user, fileData.name, fileData.path, fileData.type], (err) => {
                console.log(fileData)
            if (err) resolve ( console.error(err.message) )
            else resolve (fileData);
        })
    })

        return create;
    }

    static async getFile(id_user, type) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Desktop/Programmi/NewProject/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // GET DATA FROM DATABASE        
        const fetch = await new Promise( resolve => {

            let sql = "SELECT * FROM files WHERE id_user = ? AND type = ?"

            db.all(sql, [id_user, type], (err, rows) => {
            if (err) resolve ( console.error(err.message) )
            else resolve (rows);
        })
    })

        return fetch;
    }

    static async deleteFile(id_file) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Desktop/Programmi/NewProject/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // DELETE DATA FROM DATABASE        
        const deleteFile = await new Promise( resolve => {

            let sql = "DELETE FROM files WHERE id_file = ?"

            db.all(sql, [id_file], (err) => {
                
            if (err) resolve ( console.error(err.message) )
            else console.log("Eliminato dal database"), resolve ();
        })
    })

        return deleteFile;
    }

    static async getPathFromId(id_file) {
         // CONNECT
         const db = new sqlite3.Database('C:/Users/Stefano/Desktop/Programmi/NewProject/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // GET DATA FROM DATABASE        
        const fetch = await new Promise( resolve => {

            let sql = "SELECT path FROM files WHERE id_file = ?"

            db.all(sql, [id_file], (err, rows) => {
            if (err) resolve ( console.error(err.message) )
            else resolve (rows);
        })
    })

        return fetch;        
    }
}