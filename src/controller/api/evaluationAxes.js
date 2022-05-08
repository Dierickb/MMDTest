var AxesByProcess = require('../../models/minTicTest/EvaluationAxes');

exports.axesByProcess_list = function (req, res) {
    res.status(200).json({
        axesByProcess: AxesByProcess.axesByProcess
    });
};

