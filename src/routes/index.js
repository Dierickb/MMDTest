var express = require('express');
var router = express.Router();

const {
    getIndex,
    postIndex,
    getOurTest,
    getMinticTest,
} = require('./routes');

router.get('/', getIndex);
router.get('/OurTest', getOurTest);
router.get('/MinTicTest', getMinticTest);

router.post('/', postIndex);

module.exports = router;