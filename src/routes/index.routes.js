const express = require('express');
const router = express.Router();
const commonMiddlewares = require('../middleware/common.middleware');
const { getIndex, postIndex, } = require('./home.routes')
const { getOurTest, postOurTest, } = require('./ourTest.routes')
const { getPrevTest, postPrevTest} = require('./prevMinTicTest.routes');
const { getMinTicTest, postMinTicTest, } = require('./minTicTest.routes')
const { getTestResults } = require('./resultTest.routes')

router.get('/', getIndex);
router.get('/OurTest', commonMiddlewares.validateBusinessSector, getOurTest);
router.get('/MinTicTest', commonMiddlewares.validateBusinessSector, getMinTicTest);
router.get('/PrevTest', commonMiddlewares.validateBusinessSector,getPrevTest);
router.get('/TestResult', commonMiddlewares.validateBusinessSector, getTestResults);

router.post('/', postIndex);
router.post('/OurTest', postOurTest);
router.post('/MinTicTest', postMinTicTest);
router.post('/PrevTest', postPrevTest)

module.exports = router;

