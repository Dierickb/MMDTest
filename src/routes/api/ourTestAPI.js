var express = require('express');
var router = express.Router();
var formularioController = require('../../controller/api/formControllerAPI');

router.get('/', formularioController.formulario_list);

module.exports = router;