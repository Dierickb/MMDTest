const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const columnHeader = ["#", "Eje de evaluación", "1", "2", "3", "4", "5"];
const ProcessSelected = require("../models/minTicTest/ProcessSelected");
const AxesByProcess = require("../models/minTicTest/EvaluationAxes");
let selected = false;


const getMinticTest = (req, res) => {
    const axesByProcess = AxesByProcess.axesByProcess;
    const errors = validationResult(req);    
    if (errors.isEmpty()) {
        if (selected) {
            res.render("layouts/model/index",
                {
                    url: req.url,
                    title: "Start MinTicTest",
                    columnHeader: columnHeader,
                    process: ProcessSelected.allProcessSelected,
                    selected: selected,
                    axesByProcess: axesByProcess.axesByProcess,
                });
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }
};
const postMinTicTest = (req, res) => {
    const newLink = req.body;
};


module.exports = {
    router,
    getMinticTest,
    postMinTicTest,
};