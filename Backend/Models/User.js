const sqlite3 = require('sqlite3').verbose();


module.exports = class User {

    constructor(email, name, password) {
        this.email = email,
        this.name = name,
        this.password = password
    }

    static async check(email) {

        //CONNECT TO DATABASE
        const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {                
                return console.error(err.message);
            }
        });

        //GET DATA FROM DATABASE
        const check = await new Promise( resolve => {
            let sql = 'SELECT * FROM users WHERE email = ?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    return console.error(err.message);
                } else {
                    if ( row == undefined ) {
                        row = {
                            id : null,
                            email : "",
                            user : "",
                            password : ""
                        };
                        resolve ( row.email );
                    } else {
                        resolve( row.email );
                    }                    
                }        
              });  
        });

        return check;
    }

    static async save(user) { 

        // CONNECT TO DATABASE
         const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("errorissimo");
                return console.error(err.message);
            }
        });       

        //INSERT DATA INTO DATABASE WITH PROMISE METHOD
        const save = await new Promise( resolve => {

            let sql = 'INSERT INTO users (email, user, password) VALUES (?, ?, ?)'; 
            
            db.run(sql, [user.email, user.name, user.password], (err) => {
            if (err) {
                resolve ( console.error(err.message) );
            } else resolve (user);    
        });
        })
        return save;
    }

    static async find(email) {
         //CONNECT TO DATABASE
         const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project/Backend/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {                
                return console.error(err.message);
            }
        });

        //GET DATA FROM DATABASE
        const find = await new Promise( resolve => {

            let sql = 'SELECT * FROM users WHERE email = ?';

            db.get(sql, [email], (err, row) => {
                if (err) {
                    return console.error(err.message);
                } else  resolve ( {row} );              
              });  
        });

        return find;    
    }

}
