const express = require("express");
const router = express.Router();
const Sectors = require('../models/EconomicSector')
const { check, validationResult } = require("express-validator");
const Dimension = require("../models/ourTest/Dimension");
const AxesDimension = require('../models/ourTest/EvaluationAxes')
const FilterBySector = require('../models/minTicTest/FilerBySector');
const PushOurTest = require('../models/ourTest/PushOurTest')

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
    req.session.busisnessName = newLink.busisnessName;
    req.session.sector = newLink.sector;
    console.log(req.session.busisnessName)
    try {
        await FilterBySector.pullDB(newLink.sector);
        await Dimension.pullDB();
        await AxesDimension.pullDB();
        const idbusiness = await PushOurTest.pushBusiness(req.session.busisnessName, req.session.sector);
        if ( idbusiness !== undefined && idbusiness !== null) {
            req.session.idbusiness = idbusiness;
        } 
        res.status(200).redirect('/OurTest')
    } catch (e) {
        console.error(e)
    }   
};

module.exports = {
    router,
    getIndex,
    postIndex,
};