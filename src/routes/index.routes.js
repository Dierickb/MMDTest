var express = require('express');
var router = express.Router();

const { getIndex, postIndex, } = require('./home.routes')
const { getOurTest, postOurTest, } = require('./ourTest.routes')
const { getPrevTest, postPrevTest} = require('./prevMinTicTest.routes');
const { getMinticTest, postMinTicTest, } = require('./minTicTest.routes')

router.get('/', getIndex);
router.get('/OurTest', getOurTest);
router.get('/MinTicTest', getMinticTest);
router.get('/PrevTest', getPrevTest)

router.post('/', postIndex);
router.post('/OurTest', postOurTest);
router.post('/MinTicTest', postMinTicTest);
router.post('/PrevTest', postPrevTest)

module.exports = router;

