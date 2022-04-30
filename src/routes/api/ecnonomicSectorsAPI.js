const express = require('express');
const router = express.Router();
let economicSectorController = require('../../controller/api/economicSectorsAPI');

router.get('/v1/EconomicSector', economicSectorController.economicSector_list);

module.exports = router;