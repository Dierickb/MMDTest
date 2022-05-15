const OurTestController = require('../../ourTest/OurTest.controller');

exports.ourTestResult_list = async function (req, res) {
    res.status(200).json({
        askByDimension: await OurTestController.askByDimension
    });
};

