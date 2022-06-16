const express = require("express");
const router = express.Router();
const columnHeader = ["#", "Eje de evaluación", "1", "2", "3", "4", "5"];
const ProcessSelected = require("../models/minTicTest/ProcessSelected");
const AxesByProcess = require("../models/minTicTest/EvaluationAxes");
const DBMinTicTestController = require('../controller/minTic/DBMinTicTest.controller');

const getMinTicTest = (req, res) => {
    if (req.session.processSelected === true) {
        const axesByProcess = AxesByProcess.axesByProcess;
        res.render("layouts/model/index",
        {
            url: req.url,
            title: "Start MinTicTest",
            columnHeader: columnHeader,
            process: ProcessSelected.allProcessSelected,
            selected: true,
            sector: req.sector,
            idSector: req.idSector,
            idProcess: axesByProcess.processId,
            axesByProcess: axesByProcess.axesByProcess,
            id_eje_evaluacion: axesByProcess.id_eje_evaluacion,
            infoAxesByProcess: AxesByProcess.axesByProcess.infoAxesByProcess
        });
    } else {
        res.redirect('/PrevTest')
    }

};
const postMinTicTest = async (req, res) => {
    if (req.body.length !== 0) {
        req.session.minticTest = true;
        DBMinTicTestController.pushAskResult(req.session.idBusinessMinTic, req.body)
        await DBMinTicTestController.pushResultInfo(req.body, req.session.idBusinessMinTic)
        res.status(200).redirect('/TestResult')
    }
};

module.exports = {
    router,
    getMinTicTest,
    postMinTicTest,
};