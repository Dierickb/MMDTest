const express = require("express");
const router = express.Router();
const FilterBySector = require('../models/minTicTest/FilerBySector');
const ProcessSelected = require("../models/minTicTest/ProcessSelected");
const AxesByProcess = require("../models/minTicTest/EvaluationAxes");

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

module.exports = {
    router,
    getPrevTest,
    postPrevTest
};