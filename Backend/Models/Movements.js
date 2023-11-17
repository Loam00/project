const sqlite3 = require('sqlite3').verbose();

module.exports = class Movements {

    static async addMovement(movement) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Desktop/Programmi/NewProject/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // INSERT DATA INTO DATABASE        
        const create = await new Promise( resolve => {

            let sql = "INSERT INTO movements (id_user, object, amount) VALUES (?, ?, ?)"

            db.run(sql, [movement.id_user, movement.object, movement.amount], (err) => {
                console.log(movement)
            if (err) resolve ( console.error(err.message) )
            else resolve (movement);
        })
    })

        return create;
    }

    static async fetchMovements(id_user) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Desktop/Programmi/NewProject/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // GET DATA FROM DATABASE        
        const fetch = await new Promise( resolve => {

            let sql = "SELECT * FROM movements WHERE id_user = ?"

            db.all(sql, [id_user], (err, rows) => {
            if (err) resolve ( console.error(err.message) )
            else resolve ( rows )
        })
    })

        return fetch;
    }

    static async deleteMovements(id_movement) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Desktop/Programmi/NewProject/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // DELETE DATA FROM DATABASE        
        const deleteMovements = await new Promise( resolve => {

            let sql = "DELETE FROM movements WHERE id_movement = ?"

            db.run(sql, [id_movement], (err) => {
            if (err) resolve ( console.error(err.message) )
            else resolve ();
        })
    })

        return deleteMovements;
    }

    static async editMovements(movement) {        
        // CONNECT
        const db = new sqlite3.Database('C:/Users/Stefano/Desktop/Programmi/NewProject/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });
        
        // UPDATE DATA FROM DATABASE        
        const editMovements = await new Promise( resolve => {

            let sql = "UPDATE movements SET object = ?, amount = ? WHERE id_movement = ?"

            db.run(sql, [movement.object, movement.amount, movement.id_movement], (err) => {
            if (err) resolve ( console.error(err.message) )
            else resolve (movement);
        })
    })

        return editMovements;
    }

}