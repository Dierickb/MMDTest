var Formulario = require('../../models/formulario');

exports.formulario_list = function(req, res){
    res.status(200).json({
        formulario: Formulario.allForm
    });
};