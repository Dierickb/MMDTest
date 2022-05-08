var FilterBySector = require('../../models/minTicTest/FilerBySector');

exports.filterBySector_list = function (req, res) {
    res.status(200).json({
        filetBySector: FilterBySector.allFilterBySector   
    });
};

