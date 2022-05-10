var express = require('express');
var router = express.Router();

const {
    getOurTest,
    postOurTest,
    getMinticTest,
    postMinTicTest,
    getPrevTest,
    postPrevTest
} = require('./routes');

const { getIndex, postIndex, } = require('./home')

router.get('/', getIndex);
router.get('/OurTest', getOurTest);
router.get('/MinTicTest', getMinticTest);
router.get('/PrevTest', getPrevTest)

router.post('/', postIndex);
router.post('/OurTest', postOurTest);
router.post('/MinTicTest', postMinTicTest);
router.post('/PrevTest', postPrevTest)

module.exports = router;

