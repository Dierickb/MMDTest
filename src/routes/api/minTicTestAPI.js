var express = require('express');
var router = express.Router();
var minTicFormularioController = require('../../controller/api/minTicFormControllerAPI');

router.get('/', minTicFormularioController.minTicFormulario_list);

module.exports = router;