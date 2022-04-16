var express = require('express');
var router = express.Router();

const {
    getIndex,
    postIndex,
    getOurTest,
    postOurTest,
    getMinticTest,
    postMinTicTest
} = require('./routes');

router.get('/', getIndex);
router.get('/OurTest', getOurTest);
router.get('/MinTicTest', getMinticTest);

router.post('/', postIndex);
router.post('/OurTest', postOurTest);
router.post('/MinTicTest', postMinTicTest);

module.exports = router;

