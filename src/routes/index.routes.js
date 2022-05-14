const express = require('express');
const router = express.Router();

const { getIndex, postIndex, } = require('./home.routes')
const { getOurTest, postOurTest, } = require('./ourTest.routes')
const { getPrevTest, postPrevTest} = require('./prevMinTicTest.routes');
const { getMinTicTest, postMinTicTest, } = require('./minTicTest.routes')
const { getTestResults } = require('./resultTest.routes')

router.get('/', getIndex);
router.get('/OurTest', getOurTest);
router.get('/MinTicTest', getMinTicTest);
router.get('/PrevTest', getPrevTest);
router.get('/TestResult', getTestResults);

router.post('/', postIndex);
router.post('/OurTest', postOurTest);
router.post('/MinTicTest', postMinTicTest);
router.post('/PrevTest', postPrevTest)

module.exports = router;

