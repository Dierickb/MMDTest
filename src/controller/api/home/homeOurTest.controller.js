const OurTestResultController = require('../../home/homeOurTest.controller')

exports.SectorOur_list = async function (req, res) {
    res.status(200).json({
        resultBySector: await OurTestResultController.pullResultBySector(parseInt(req.params.idSector))
    });
};
