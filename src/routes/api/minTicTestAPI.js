var express = require('express');
var router = express.Router();
var formularioController = require('../../controller/api/minTicFormControllerAPI');

router.get('/', formularioController.formulario_list);

module.exports = router;