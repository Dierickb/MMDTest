const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const columnHeader = ["#", "Preguntas", "1", "2", "3", "4", "5"];
const OurFormulario = require("../models/ourFormulario");
const ourFormulario = Object.values(OurFormulario)[0];
const Sectors = require('../models/economicSector')
const FilterBySector = require('../models/filerBySector')

const connection = require('../accessDB')
const dierick = {
    process: "Procesos",
    habilitador: "Habilitadores"
}
const getIndex = (req, res) => {
    req.session.selected = false
    const errors = validationResult(req);
    let sector = []; k = 0;
    let idSector = [];
    for (let value of Sectors.allSectors) {
        sector[k] = value.tipo_empresas;
        idSector[k] = value.id_tipo_empresa;
        k = k + 1;
    }
    if (errors.isEmpty()) {
        req.session.busisnessName = '';
        req.session.department = 'ddd';
        res.render("index", { title: "MMD Test", sector: sector, idSector: idSector });
    } else {
        console.error(e);
    }
};
const postIndex = (req, res) => {
    const newLink = req.body;
    FilterBySector.pullDB(newLink.sector)
    req.session.busisnessName = newLink.busisnessName;
    res.status(200).redirect('/OurTest')
};

const getOurTest = (req, res) => {
    const url = req.url;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            if (req.session.busisnessName === '' || req.session.department === 'Seleccione el departamento') {
                res.redirect('/')
            } else {
                res.render("layouts/model/index",
                    {
                        url: url,
                        title: "Start Test",
                        formulario: ourFormulario,
                        columnHeader: columnHeader,
                        process: dierick,
                        selected: req.session.selected,
                    });
            }
        } catch (e) {
            console.log(e)
        }
    } else {
        res.redirect('/')
    };
};

const postOurTest = (req, res) => {
    const newLink = req.body;
    if (newLink.lenght !== 0) {
        req.session.ourTestFull = true;
        console.log('');
        console.log(newLink);
        console.log('');
    };
};

const getMinticTest = (req, res) => {
    const url = req.url;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        console.log(FilterBySector.allFilterBySector)
        if (req.session.ourTestFull = true) {
            res.render("layouts/model/index",
                {
                    url: url,
                    title: "Start MinTicTest",
                    columnHeader: columnHeader,
                    formulario: ourFormulario,
                    selected: req.session.selected,
                });
        }
    } else {
        res.redirect('/OurTest')
    };
};
const postMinTicTest = (req, res) => {
    const newLink = req.body;
    console.log('');
    console.log(newLink);
    console.log('');
};

module.exports = {
    router,
    getIndex,
    postIndex,
    getOurTest,
    postOurTest,
    getMinticTest,
    postMinTicTest
};