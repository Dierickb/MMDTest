const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const columnHeader = ["#", "Eje de evaluación", "1", "2", "3", "4", "5"];
const ProcessSelected = require("../models/minTicTest/ProcessSelected");
const AxesByProcess = require("../models/minTicTest/EvaluationAxes");
const Sectors = require('../models/EconomicSector');
const DBMinTicTest = require('../controller/minTic/DBMinTicTest.controller');

const getMinTicTest = (req, res) => {
    let sector = [];
    let k = 0; let idSector = [];
    for (let value of Sectors.allSectors) {
        sector[k] = value.tipo_empresas;
        idSector[k] = value.id_tipo_empresa;
        k = k + 1;
    }

    const errors = validationResult(req);
    if (errors.isEmpty() && req.session.selected) {                
        if (req.session.processSelected === true) {
            const axesByProcess = AxesByProcess.axesByProcess;
            
            res.render("layouts/model/index",
            {
                url: req.url,
                title: "Start MinTicTest",
                columnHeader: columnHeader,
                process: ProcessSelected.allProcessSelected,
                selected: true,
                sector: sector, 
                idSector: idSector,
                idProcess: axesByProcess.processId,
                axesByProcess: axesByProcess.axesByProcess,
                id_eje_evaluacion: axesByProcess.id_eje_evaluacion,
            });
        } else {
            res.redirect('/PrevTest')
        }
        
    } else {
        res.redirect('/')
    }
};
const postMinTicTest = async (req, res) => {
    if (req.body.lenght !== 0) {
        DBMinTicTest.pushAskResult(req.session.idBusinessMinTic, req.body)
        await DBMinTicTest.pushResultInfo(req.body)
        res.status(200).redirect('/PrevTest')
    }
};

module.exports = {
    router,
    getMinTicTest,
    postMinTicTest,
};