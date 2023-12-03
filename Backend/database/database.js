const sqlite3 = require('sqlite3').verbose();

let sql;

// CONNECT TO DB

const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// CREATE A NEW TABLE

/* sql = 'CREATE TABLE users (id_user INTEGER PRIMARY KEY, user VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)';
db.run(sql); */

/* sql = 'CREATE TABLE notes (id_notes INTEGER PRIMARY KEY, id_user INT NOT NULL, title VARCHAR(255) NOT NULL, text TEXT, created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(id_user) REFERENCES users(id_user))';
db.run(sql); */

/* sql = 'CREATE TABLE movements (id_movement INTEGER PRIMARY KEY, id_user INT NOT NULL, object VARCHAR(255) NOT NULL, amount INT, created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(id_user) REFERENCES users(id_user))';
db.run(sql); */

/* sql = 'CREATE TABLE files (id_file INTEGER PRIMARY KEY, id_user INT NOT NULL, name VARCHAR(255) NOT NULL, path VARCHAR(255), type VARCHAR(255), created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(id_user) REFERENCES users(id_user))';
db.run(sql); */

// DROP A TABLE

/*  sql = 'DROP TABLE files';
 db.run(sql); */

// QUERY THE DATABASE

sql = 'SELECT * FROM movements';
db.all(sql, (err, rows) => {
    if (err) return console.error(err.message);
    
    rows.forEach( (row ) => {
        console.log(row);
    })
    
});

/* sql = "SELECT * FROM files WHERE id_user = ? AND type = ?"

        db.all(sql, [1, 'audio'], (err, rows) => {
            if (err) ( console.error(err.message) )
            else console.log(rows);
        }) */


/* const ciao = db.get("SELECT COUNT(*) FROM notes", (err, row) => {
    console.log(row)
});

console.log(ciao + "eh") */

/* sql = 'SELECT * FROM users WHERE email = ?';
db.get(sql, ['ciccio@gmail.com'], (err, rows) => {
    if (err) return console.error(err.message);
    console.log(rows);
}); */

// INSERT DATA INTO TABLE

/* sql = 'INSERT INTO users (email, user, password) VALUES (?, ?, ?)';
db.run(sql, ["ciccio@gmail.com", "Negraccio", "123456789"], (err) => {
    if (err) return console.error(err.message);    
}); */

// UPDATE DATA

/* sql = 'UPDATE users SET user_name = ? WHERE id = ?';
db.run(sql, ['Gino', 1], (err) => {
    if (err) return console.error(err.message);
}) */

// DELETE DATA
 
/* sql = 'DELETE FROM movements WHERE id_movement = ?';
db.run(sql, [2], (err) => {
    if (err) return console.error(err.message);
}) */