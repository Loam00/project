const sqlite3 = require('sqlite3').verbose();

module.exports = class Note {

    static async createNote(note) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // INSERT DATA INTO DATABASE        
        const create = await new Promise( resolve => {

            let sql = "INSERT INTO notes (id_user, title, text) VALUES (?, ?, ?)"

            db.run(sql, [note.id_user, note.title, note.text], (err) => {
                console.log(note)
            if (err) resolve ( console.error(err.message) )
            else resolve (note);
        })
    })

        return create;
    }

    static async fetchNotes(id_user) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // GET DATA FROM DATABASE        
        const fetch = await new Promise( resolve => {

            let sql = "SELECT * FROM notes WHERE id_user = ?"

            db.all(sql, [id_user], (err, rows) => {
            if (err) resolve ( console.error(err.message) )
            else resolve ( rows )
        })
    })

        return fetch;
    }

    static async deleteNotes(id_notes) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // DELETE DATA FROM DATABASE        
        const deleteNote = await new Promise( resolve => {

            let sql = "DELETE FROM notes WHERE id_notes = ?"

            db.run(sql, [id_notes], (err) => {
            if (err) resolve ( console.error(err.message) )
            else resolve ();
        })
    })

        return deleteNote;
    }

    static async editNotes(note) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // UPDATE DATA FROM DATABASE        
        const editNote = await new Promise( resolve => {

            let sql = "UPDATE notes SET title = ?, text = ? WHERE id_notes = ?"

            db.run(sql, [note.title, note.text, note.id_notes], (err) => {
            if (err) resolve ( console.error(err.message) )
            else resolve (note);
        })
    })

        return editNote;
    }

}