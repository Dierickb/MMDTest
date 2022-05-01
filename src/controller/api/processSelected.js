var ProcessSelected = require('../../models/processSelected');

exports.processSelected_list = function (req, res) {
    res.status(200).json({
        processSelected: ProcessSelected.allProcessSelected   
    });
};

