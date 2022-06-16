const OurTestController = require('../../ourTest/OurTest.controller');

exports.ourTestResult_list = async function (req, res) {
    res.status(200).json({
        askByDimension: await OurTestController.askByDimension,
    });
};

exports.ourTestResultLevel_list = async function (req, res) {
    res.status(200).json({
        levelByDimension: await OurTestController.pullCriterionByDimension(
            parseInt(req.params.dimensionId), parseInt(req.params.level)
        )
    });
};

