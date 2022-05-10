const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Dimension = require("../models/ourTest/Dimension");
const AxesDimension = require('../models/ourTest/EvaluationAxes')
const FilterBySector = require('../models/minTicTest/FilerBySector');

const getIndex = (req, res) => {
    const errors = validationResult(req);
    let sector = []; k = 0; let idSector = [];
    for (let value of Sectors.allSectors) {
        sector[k] = value.tipo_empresas;
        idSector[k] = value.id_tipo_empresa;
        k = k + 1;
    }
    if (errors.isEmpty()) {
        res.render("index", { title: "MMD Test", sector: sector, idSector: idSector });
    } else {
        console.error(e);
    }
};

const postIndex = async (req, res) => {
    const newLink = req.body;
    await FilterBySector.pullDB(newLink.sector);
    await Dimension.pullDB();
    await AxesDimension.pullDB();
    req.session.busisnessName = newLink.busisnessName;
    req.session.sector = newLink.sector;
    res.status(200).redirect('/OurTest')

};

module.exports = {
    router,
    getIndex,
    postIndex,
};