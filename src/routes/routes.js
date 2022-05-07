const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const columnHeader = ["#", "Eje de evaluación", "1", "2", "3", "4", "5"];
const OurFormulario = require("../models/ourFormulario");
const ourFormulario = Object.values(OurFormulario)[0];
const Sectors = require('../models/economicSector')
const FilterBySector = require('../models/filerBySector');
const ProcessSelected = require("../models/processSelected");
const AxesByProcess = require("../models/EvaluationAxes");
let selected = false;

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
    req.session.busisnessName = newLink.busisnessName;
    req.session.sector = newLink.sector;
    res.status(200).redirect('/OurTest')

};

const getOurTest = (req, res) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            if (req.session.busisnessName === '' || req.session.sector === 'Sector empresarial') {
                res.redirect('/')
            } else {
                res.render("layouts/model/index",
                    {
                        url: req.url,
                        title: "Start Test",
                        columnHeader: columnHeader,
                        selected: selected,
                    });
            }
        } catch (e) {
            throw new Error(e.message)
        }2
    } else {
        res.redirect('/')
    }
};
const postOurTest = (req, res) => {
    const newLink = req.body;
    if (newLink.lenght !== 0) {
        req.session.ourTestFull = true;
    }
};

const getPrevTest = async (req, res) => {
    const url = req.url;
    const columnHeader = ["#", "Proceso", ""];
    const processBySector = await FilterBySector.allFilterBySector;
    if (req.session.selected) {        
        res.status(200).redirect('/MinTicTest')
    } else {
        req.session.selected = false
        res.render("layouts/model/index",
            {
                title: "Previus to test",
                url: url,
                selected: req.session.selected,
                process: processBySector,
                columnHeader: columnHeader,
            }
        );
    }
}
const postPrevTest = async (req, res) => {
    let processSelected = {
        idSector: FilterBySector.allFilterBySector.sectorId,
        sector: FilterBySector.allFilterBySector.sector,
        process: [],
        processId: req.body,
        length: req.body.length
    }
    const processId = FilterBySector.allFilterBySector.processId;
    const process = FilterBySector.allFilterBySector.process;
    
    let i = 0;
    processSelected.processId.forEach(element => {
        processSelected.process[i] = process[processId.indexOf(element)];
        i=i+1;
    }); 
    await ProcessSelected.add(processSelected);
    let [idProcess, tagProcess, axesByProcess] = await AxesByProcess.pullDB(ProcessSelected.allProcessSelected.processId);
    let idSector = ProcessSelected.allProcessSelected.idSector;
    let sector = ProcessSelected.allProcessSelected.sector;
    await AxesByProcess.add(idSector, sector, idProcess, tagProcess, axesByProcess)
    //req.session.selected = true;
    selected = true;
    res.status(200).redirect('/MinTicTest')
}

const getMinticTest = (req, res) => {
    const axesByProcess = AxesByProcess.axesByProcess;
    const errors = validationResult(req);    
    if (errors.isEmpty()) {
        if (selected) {
            res.render("layouts/model/index",
                {
                    url: req.url,
                    title: "Start MinTicTest",
                    columnHeader: columnHeader,
                    process: ProcessSelected.allProcessSelected,
                    selected: selected,
                    axesByProcess: axesByProcess.axesByProcess,
                });
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }
};
const postMinTicTest = (req, res) => {
    const newLink = req.body;
};

module.exports = {
    router,
    getIndex,
    postIndex,
    getOurTest,
    postOurTest,
    getMinticTest,
    postMinTicTest,
    getPrevTest,
    postPrevTest
};