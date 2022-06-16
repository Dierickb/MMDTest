const express = require('express');
const router = express.Router();
const EconomicSector = require('../models/EconomicSector')
const { check, validationResult } = require("express-validator");

const validateBusinessSector = (req, res,next) => {
    const errors = validationResult(req);
    if (errors.isEmpty() && req.session.selected) {
        let sector = []; let idSector = [];
        for (let value of EconomicSector.allSectors) {
            sector.push(value.tipo_empresas);
            idSector.push(value.id_tipo_empresa);
        }
        req.sector = sector;
        req.idSector = idSector;
        next();
    } else {
        res.status(200).redirect('/')
    }
}

module.exports = {
    router,
    validateBusinessSector
}
