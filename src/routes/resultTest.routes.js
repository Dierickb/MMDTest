const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const DBMinTicTest = require('../controller/minTic/DBMinTicTest.controller');
const Sectors = require('../models/EconomicSector');

const getTestResults = (req, res) => {
    let sector = []; k = 0; let idSector = [];
    for (let value of Sectors.allSectors) {
        sector[k] = value.tipo_empresas;
        idSector[k] = value.id_tipo_empresa;
        k = k + 1;
    }
    const errors = validationResult(req);
    if (errors.isEmpty() && req.session.selected) {
        if ( req.session.minticTest || req.session.OurTest ) {
            res.render("layouts/model/testResults/testResult", { 
                title: "MMD Test Result", 
                selected: req.session.selected,
                sector: sector, 
                idSector: idSector,
                ourTest: req.session.OurTest,
                minTicTest: req.session.minticTest,
            });
        }         
    }
}

module.exports = {
    getTestResults,
}