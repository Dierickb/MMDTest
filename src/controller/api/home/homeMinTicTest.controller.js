const DBMinTicTestResultController = require('../../home/homeMinTicTest.controller')

exports.DBMinTicTestResultController_list = async function (req, res) {
    res.status(200).json({
        DBMinTicTestResultController: await DBMinTicTestResultController.pullResultBySector(parseInt(req.params.idSector)),
    });
};

