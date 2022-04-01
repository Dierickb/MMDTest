const express = require("express");
const router = express.Router();
const columnHeader = ["#", "Preguntas", "1", "2", "3", "4", "5"];
const Formulario = require("../models/formulario");
const formulario = Object.values(Formulario)[0];

const getIndex = (req, res, next) => {
    res.render("index", { title: "MMD Test", });
};
const getTest = (req, res, next) => {

    res.render("layouts/model/carousel",
        {
            title: "Start Test",
            formulario: formulario,
            columnHeader: columnHeader,
        });
};

module.exports = {
    router,
    getIndex,
    getTest,
};