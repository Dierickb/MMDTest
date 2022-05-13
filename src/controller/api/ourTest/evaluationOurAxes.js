const AxesDimension = require('../../../models/ourTest/EvaluationAxes');

exports.axesDimension_list = async function (req, res) {
    res.status(200).json({
        axesDimension: await AxesDimension.pullDB()
    });
};

