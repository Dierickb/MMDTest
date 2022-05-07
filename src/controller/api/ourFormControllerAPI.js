var OurFormulario = require('../../models/OurFormulario');

exports.formulario_list = function(req, res){
    res.status(200).json({
        ourFormulario: OurFormulario.allForm
    });
};