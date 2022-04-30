var MinTicForm = require('../../models/minTicForm');

exports.minTicFormulario_list = function(req, res){
    res.status(200).json({
        minTicFormulario: MinTicForm.allForm
    });
};

