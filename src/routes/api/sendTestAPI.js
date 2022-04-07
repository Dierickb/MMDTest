var express = require('express');
var router = express.Router();
var formularioController = require('../../controller/api/ourFormControllerAPI');

router.get('/', formularioController.formulario_list);

module.exports = router;