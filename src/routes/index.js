var express = require('express');
var router = express.Router();

const {
    getIndex,
    getOurTest,
    getMinticTest,
} = require('./routes');

router.get('/', getIndex);
router.get('/OurTest', getOurTest);
router.get('/MinTicTest', getMinticTest);

module.exports = router;