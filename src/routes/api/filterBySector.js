const express = require('express');
const router = express.Router();
let filterBySector_list = require('../../controller/api/filterBySector');

router.get('/v1/FilterBySector', filterBySector_list.filterBySector_list);

module.exports = router;