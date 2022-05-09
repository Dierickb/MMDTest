const express = require('express');
const router = express.Router();

const ourTestAPI = require('./ourTestAPI');
const evaluationAxes = require('./evaluationAxes');
const filterBySector = require('./filterBySector');
const economicSector = require('./ecnonomicSectorsAPI');
const dimension = require('./dimensionAPI')
const axesDimension = require('./axesDimension')

router.get('/ourTestApi', ourTestAPI)
router.get('/evaluationAxes', evaluationAxes)
router.get('/filterBySector', filterBySector)
router.get('/economicSector', economicSector)
router.get('/dimension', dimension)
router.get('/axesDimension', axesDimension)

module.exports = (
    router
)