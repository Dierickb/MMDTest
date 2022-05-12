const express = require("express");
const router = express.Router();
const Sectors = require('../models/EconomicSector')
const { check, validationResult } = require("express-validator");
const Dimension = require("../models/ourTest/Dimension");
const AxesDimension = require('../models/ourTest/EvaluationAxes')
const FilterBySector = require('../models/minTicTest/FilerBySector');
const PushOurTest = require('../models/ourTest/PushOurTest')
const DBMinTicTest = require('../controller/minTic/DBMinTicTest')

const getIndex = (req, res) => {
    console.log("")
    console.log(req.url)
    console.log("")
    const errors = validationResult(req);
    let sector = []; k = 0; let idSector = [];
    for (let value of Sectors.allSectors) {
        sector[k] = value.tipo_empresas;
        idSector[k] = value.id_tipo_empresa;
        k = k + 1;
    }
    if (errors.isEmpty()) {
        res.render("index", { 
            title: "MMD Test", 
            sector: sector, 
            idSector: idSector,
            selected: req.session.selected
        });
    } else {
        console.error(e);
    }
};

const postIndex = async (req, res) => {
    const newLink = req.body;
    let {redirect} = req.query;
    console.log("")
    console.log(redirect);
    try {
        await FilterBySector.pullDB(newLink.sector);
        await Dimension.pullDB();
        await AxesDimension.pullDB();
        const idbusinessMinTic = await DBMinTicTest.pushBusiness(newLink.busisnessName, newLink.sector);
        const idbusiness = await PushOurTest.pushBusiness(newLink.busisnessName, newLink.sector);
        if ( idbusiness !== undefined && idbusiness !== null) {
            req.session.idbusiness = idbusiness;
            req.session.selected = true;
        } 
        res.status(200).redirect(`/${redirect}`)
    } catch (e) {
        console.error(e)
    }   
};

module.exports = {
    router,
    getIndex,
    postIndex,
};