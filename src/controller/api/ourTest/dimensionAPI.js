var Dimension = require('../../../models/ourTest/Dimension');

exports.dimension_list = async function (req, res) {
    res.status(200).json({
        Dimension: await Dimension.pullDB()
    });
};

