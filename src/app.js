const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const engine = require('ejs-mate');
const path = require('path');
require("dotenv").config();

// initializations
const app = express();

// settings
app.engine("ejs", engine);
app.set("port", process.env.WEBPORT || 80);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 5 // Equals 5 hours
        }
    })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
const indexRouter = require('./routes/index.routes');
const indexApi = require('./routes/api/index')
app.use('/', indexRouter);
app.use('/api/v1', indexApi)


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