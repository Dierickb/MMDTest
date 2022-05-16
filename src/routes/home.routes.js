const express = require("express");
const router = express.Router();
const Sectors = require('../models/EconomicSector');
const { check, validationResult } = require("express-validator");
const Dimension = require("../models/ourTest/Dimension");
const AxesDimension = require('../models/ourTest/EvaluationAxes')
const FilterBySector = require('../models/minTicTest/FilerBySector');
const PushOurTest = require('../controller/ourTest/OurTest.controller')
const DBMinTicTest = require('../controller/minTic/DBMinTicTest.controller')

const getIndex = async (req, res) => {
    const errors = validationResult(req);
    let sector = []; k = 0; let idSector = [];
    for (let value of Sectors.allSectors) {
        sector[k] = value.tipo_empresas;
        idSector[k] = value.id_tipo_empresa;
        PushOurTest.idSector[value.id_tipo_empresa] = value.tipo_empresas;
        k = k + 1;
    }
    if (errors.isEmpty()) {
        res.render("index", { 
            title: "MMD Test", 
            sector: sector, 
            idSector: idSector,
            selected: req.session.selected,
            url: req.url
        });
    } else {
        console.error(e);
    }
};

const postIndex = async (req, res) => {
    const newLink = req.body;
    let {redirect} = req.query;
    try {
        await FilterBySector.pullDB(newLink.sector);
        await Dimension.pullDB();
        await AxesDimension.pullDB();
        const idBusinessMinTic = await DBMinTicTest.pushBusiness(newLink.busisnessName, newLink.sector);
        const idBusiness = await PushOurTest.pushBusiness(newLink.busisnessName, newLink.sector);
        if ( idBusiness !== undefined && idBusiness !== null) {
            req.session.idbusiness = idBusiness;
            req.session.selected = true;
        } 
        if (idBusinessMinTic !== undefined && idBusinessMinTic !==null){
            req.session.idBusinessMinTic = idBusinessMinTic;
        }
        if (redirect.length === 0) {
            res.status(200).redirect('/OurTest')
        } else {
            res.status(200).redirect(`/${redirect}`)
        }
        
    } catch (e) {
        console.error(e)
    }   
};

module.exports = {
    router,
    getIndex,
    postIndex,
};