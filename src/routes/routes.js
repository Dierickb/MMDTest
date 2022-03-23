const express = require("express");
const router = express.Router();

const {
    questions,
    dimensions,
    columnHeader,
} = require('./preguntas');

const getIndex = (req, res, next) => {
    res.render("index", { title: "MMD Test", });
};
const getTest = (req, res, next) => {
    res.render("layouts/model/carousel",
        {
            title: "Start Test",
            dimensions: dimensions,
            columnHeader: columnHeader,
        });    
};

module.exports = {
    router,
    getIndex,
    getTest,
};