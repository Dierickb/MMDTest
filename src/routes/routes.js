const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const columnHeader = ["#", "Preguntas", "1", "2", "3", "4", "5"];
const OurFormulario = require("../models/ourFormulario");
const ourFormulario = Object.values(OurFormulario)[0];

const getIndex = (req, res, next) => {
    res.render("index", { title: "MMD Test", });
};
const postIndex = (req, res) => {
    const newLink = req.body;
    const errors = validationResult(req);
    console.log("")
    console.log(newLink)
    console.log("")
};

const getOurTest = (req, res, next) => {
    const url = req.url;
    res.render("layouts/model/carousel",
        {
            url: url,
            title: "Start Test",
            formulario: ourFormulario,
            columnHeader: columnHeader,
        });
};

const getMinticTest = (req, res, next) => {
    const url = req.url;
    res.render("layouts/model/carousel",
        {
            url: url,
            title: "Start MinTicTest",
            columnHeader: columnHeader,
            formulario: ourFormulario,
        });
};

module.exports = {
    router,
    getIndex,
    postIndex,
    getOurTest,
    getMinticTest,
};