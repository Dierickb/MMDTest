const DBMinTicTestResultController = require('../../home/homeMinTicTest.controller')
const OurTestResultController = require('../../home/homeOurTest.controller')

exports.Sector_list = async function (req, res) {
    res.status(200).json({
        sectorMinTic: await DBMinTicTestResultController.pullSector(),
        secorOurTest: await OurTestResultController.pullSector()
    });
};

