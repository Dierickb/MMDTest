var ProcessSelected = require('../../models/minTicTest/ProcessSelected');

exports.processSelected_list = function (req, res) {
    res.status(200).json({
        processSelected: ProcessSelected.allProcessSelected   
    });
};

