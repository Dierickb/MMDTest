const express = require('express');
const router = express.Router();

const ourTestAPI = require('./ourTestAPI');
const evalutionAxes = require('./evaluationAxes')
const filterBySector = require('./filterBySector')
const economicSector = require('./ecnonomicSectorsAPI')

router.get('/ourTestApi', ourTestAPI)
router.get('/evalutionAxes', evalutionAxes)
router.get('/filterBySector', filterBySector)
router.get('/economicSector', economicSector)

module.exports = (
    router
)