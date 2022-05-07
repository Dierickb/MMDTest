var ProcessSelected = require('../../models/ProcessSelected');

exports.processSelected_list = function (req, res) {
    res.status(200).json({
        processSelected: ProcessSelected.allProcessSelected   
    });
};

