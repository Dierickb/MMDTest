var AxesByProcess = require('../../models/EvaluationAxes');

exports.axesByProcess_list = function (req, res) {
    res.status(200).json({
        axesByProcess: AxesByProcess.axesByProcess
    });
};

