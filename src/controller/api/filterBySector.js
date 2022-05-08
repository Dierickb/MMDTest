var FilterBySector = require('../../models/FilerBySector');

exports.filterBySector_list = function (req, res) {
    res.status(200).json({
        filetBySector: FilterBySector.allFilterBySector   
    });
};

