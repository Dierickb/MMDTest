const express = require("express");
const router = express.Router();
const Sectors = require('../models/EconomicSector');

const getTestResults = (req, res) => {
    let sector = []; let idSector = [];
    for (let value of Sectors.allSectors) {
        sector.push(value.tipo_empresas);
        idSector.push(value.id_tipo_empresa);
    }
    if ( req.session.minticTest || req.session.OurTest ) {
        res.render("layouts/model/testResults/testResult", {
            title: "MMD Test Result",
            selected: req.session.selected,
            sector: sector,
            idSector: idSector,
            ourTest: req.session.OurTest,
            minTicTest: req.session.minticTest,
        });
    } else {
        res.status(200).redirect('/')
    }
}

module.exports = {
    router,
    getTestResults,
}