const DBMinTicTest = require('../../minTic/DBMinTicTest.controller');

exports.minTicResult_list = async function (req, res) {
    res.status(200).json({
        minTicResult: await DBMinTicTest.allAskResults
    });
};

