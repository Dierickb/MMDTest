var express = require('express');
var router = express.Router();

const {
    getIndex,
    getTest,
} = require('./routes')

router.get('/', getIndex);
router.get('/StartTest', getTest);

module.exports = router;