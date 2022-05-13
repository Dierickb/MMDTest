const AxesByProcess = require('../../../models/minTicTest/EvaluationAxes');

exports.axesByProcess_list = async function (req, res) {
    res.status(200).json({
        axesByProcess: await AxesByProcess.axesByProcess
    });
};

