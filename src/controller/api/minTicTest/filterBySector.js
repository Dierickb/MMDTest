var FilterBySector = require('../../../models/minTicTest/FilerBySector');

exports.filterBySector_list = async function (req, res) {
    res.status(200).json({
        filetBySector: await FilterBySector.allFilterBySector
    });
};

