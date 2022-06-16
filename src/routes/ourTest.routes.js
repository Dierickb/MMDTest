const express = require("express");
const router = express.Router();
const columnHeader = ["#", "Eje de evaluación", "1", "2", "3", "4", "5"];
const AxesDimension = require('../models/ourTest/EvaluationAxes');
const OurTest = require('../controller/ourTest/OurTest.controller');
const Sectors = require('../models/EconomicSector');
const {body} = require("express-validator");

const getOurTest = (req, res, next) => {
    try {
        OurTest.createArrayDimension(AxesDimension.allAxesByDimension)
        res.render("layouts/model/index",
            {
                url: req.url,
                title: "Start Test",
                columnHeader: columnHeader,
                dimension: AxesDimension.allAxesByDimension,
                process: AxesDimension.allDimension,
                sector: req.sector,
                idSector: req.idSector,
                selected: true
            });
    } catch (e) {
        throw new Error(e.message)
    }

};
const postOurTest = async (req, res) => {
    if (req.body.length !== 0) {
        req.session.OurTest = true;
        await OurTest.pushAskResult(req.session.idbusiness, req.body)
        await OurTest.pushAskResultInfo(req.body, req.session.idbusiness)
        res.status(200).redirect('/PrevTest')
    }
};

module.exports = {
    router,
    getOurTest,
    postOurTest,
};