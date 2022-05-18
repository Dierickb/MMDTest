const express = require('express');
const router = express.Router();

const ourTestAPI = require('./ourTest/ourTestAPI');
const evaluationAxes = require('./minTicTest/evaluationAxes');
const filterBySector = require('./minTicTest/filterBySector');
const economicSector = require('./ecnonomicSectorsAPI');
const dimension = require('./ourTest/dimensionAPI');
const axesDimension = require('./ourTest/axesDimension');
const minTicResult = require('./results/minTicResult');
const ourTestResult = require('./results/ourTestResult')
const DBMinTicTestResultController = require('./home/homeMinTicTestAPI')
const sectorList = require('./home/home')

router.get('/',sectorList)
router.get('/ourTestApi', ourTestAPI)
router.get('/MinTicTest', evaluationAxes)
router.get('/filterBySector', filterBySector)
router.get('/economicSector', economicSector)
router.get('/dimension', dimension)
router.get('/OurTest', axesDimension)
router.get('/minTicResult', minTicResult)
router.get('/ourTestResult', ourTestResult)
router.get('/DBMinTicTestResult/:idSector', DBMinTicTestResultController)

module.exports = (
    router
)