const DBMinTicTestResultController = require('../../home/homeMinTicTest.controller')

exports.Sector_list = async function (req, res) {
    res.status(200).json({
        sector: await DBMinTicTestResultController.pullSector()
    });
};

