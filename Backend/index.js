const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');
const movementRoutes = require('./routes/movements');
const archiveRoutes = require('./routes/archive');
/* const errorController = require('./controllers/error'); */

const app = express();

const ports = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/images", express.static(path.join("images")));
app.use("/documents", express.static(path.join("documents")));

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/purse", movementRoutes);
app.use("/archive", archiveRoutes);

app.listen(ports, () => console.log(`Listening on port ${ports}`));