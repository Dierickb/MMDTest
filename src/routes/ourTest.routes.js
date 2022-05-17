const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const columnHeader = ["#", "Eje de evaluación", "1", "2", "3", "4", "5"];
const AxesDimension = require('../models/ourTest/EvaluationAxes');
const OurTest = require('../controller/ourTest/OurTest.controller');
const Sectors = require('../models/EconomicSector');

const getOurTest = (req, res) => {
    const errors = validationResult(req);
    let sector = [];
    let k = 0; let idSector = [];
    for (let value of Sectors.allSectors) {
        sector[k] = value.tipo_empresas;
        idSector[k] = value.id_tipo_empresa;
        k = k + 1;
    }

    if (errors.isEmpty() && req.session.selected) {
        try {            
            OurTest.createArrayDimension(AxesDimension.allAxesByDimension)

            res.render("layouts/model/index",
                {
                    url: req.url,
                    title: "Start Test",
                    columnHeader: columnHeader,
                    dimension: AxesDimension.allAxesByDimension,
                    process: AxesDimension.allDimension,
                    sector: sector, 
                    idSector: idSector,
                    selected: true
                });
        } catch (e) {
            throw new Error(e.message)
        }
    } else {
        res.redirect('/')
    }
};
const postOurTest = async (req, res) => {
    if (req.body.lenght !== 0) {
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