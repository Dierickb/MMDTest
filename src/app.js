const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const engine = require('ejs-mate');
const path = require('path');
require("dotenv").config();

// initializations
const app = express();

// settings
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);
app.engine("ejs", engine);
app.set("port", process.env.WEBPORT || 80);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

// Global Variables

app.use(express.json());

//Routes
const indexRouter = require('./routes/index');
const ourFormAPIRouter = require('./routes/api/ourTestAPI');
const minTicFormAPIRouter = require('./routes/api/minTicTestAPI');
const economicSector = require('./routes/api/ecnonomicSectorsAPI');
const filterBySector = require('./routes/api/filterBySector');

app.use('/', indexRouter);

app.use('/api', ourFormAPIRouter);
app.use('/api', minTicFormAPIRouter);
app.use('/api', economicSector);
app.use('/api', filterBySector)


//Public
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        res.redirect('/');
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Page not found');
});

module.exports = app;