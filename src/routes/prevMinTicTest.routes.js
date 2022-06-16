const express = require("express");
const router = express.Router();
const FilterBySector = require('../models/minTicTest/FilerBySector');
const ProcessSelected = require("../models/minTicTest/ProcessSelected");
const AxesByProcess = require("../models/minTicTest/EvaluationAxes");

const getPrevTest = async (req, res) => {
    const url = req.url;
    const columnHeader = ["#", "Proceso", ""];
    const processBySector = await FilterBySector.allFilterBySector;

    res.render("layouts/model/index",
        {
            title: "Previus to test",
            url: url,
            selected: false,
            process: processBySector,
            columnHeader: columnHeader,
            sector: req.sector,
            idSector: req.idSector,
        }
    );
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

    processSelected.processId.forEach(element => {
        processSelected.process.push(process[processId.indexOf(element)])
    }); 

    await ProcessSelected.add(processSelected);
    let idSector = ProcessSelected.allProcessSelected.idSector;
    let sector = ProcessSelected.allProcessSelected.sector;

    let [idProcess, tagProcess, axesByProcess, id_eje_evaluacion, infoAxesByProcess] = await AxesByProcess.pullDB(ProcessSelected.allProcessSelected.processId);
    await AxesByProcess.add(idSector, sector, idProcess, tagProcess, axesByProcess, id_eje_evaluacion, infoAxesByProcess)

    req.session.processSelected = req.body.length !== 0;
    res.status(200).redirect('/MinTicTest')
}

module.exports = {
    router,
    getPrevTest,
    postPrevTest
};