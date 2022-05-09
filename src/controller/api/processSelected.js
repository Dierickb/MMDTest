var ProcessSelected = require('../../models/minTicTest/ProcessSelected');

exports.processSelected_list = async function (req, res) {
    res.status(200).json({
        processSelected: await ProcessSelected.allProcessSelected
    });
};

