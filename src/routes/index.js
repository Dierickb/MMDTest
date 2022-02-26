var express = require('express');
var router = express.Router();

const {
    getIndex,
} = require('./routes')

router.get('/', getIndex);

module.exports = router;