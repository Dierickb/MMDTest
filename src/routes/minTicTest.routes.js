const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const columnHeader = ["#", "Eje de evaluación", "1", "2", "3", "4", "5"];
const ProcessSelected = require("../models/minTicTest/ProcessSelected");
const AxesByProcess = require("../models/minTicTest/EvaluationAxes");
const Sectors = require('../models/EconomicSector')

const getMinticTest = (req, res) => {
    let sector = []; k = 0; let idSector = [];
    for (let value of Sectors.allSectors) {
        sector[k] = value.tipo_empresas;
        idSector[k] = value.id_tipo_empresa;
        k = k + 1;
    }

    const axesByProcess = AxesByProcess.axesByProcess;
    const errors = validationResult(req);
    if (errors.isEmpty() && req.session.selected) {
        if (req.session.processSelected === true) {
            res.render("layouts/model/index",
            {
                url: req.url,
                title: "Start MinTicTest",
                columnHeader: columnHeader,
                process: ProcessSelected.allProcessSelected,
                selected: true,
                sector: sector, 
                idSector: idSector,
                axesByProcess: axesByProcess.axesByProcess,
            });
        } else {
            res.redirect('/PrevTest')
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