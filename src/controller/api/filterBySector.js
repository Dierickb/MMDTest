var FilterBySector = require('../../models/filerBySector');

exports.filterBySector_list = function (req, res) {
    res.status(200).json(
        FilterBySector.allFilterBySector
    );
};

