var Sectors = require('../../models/EconomicSector');

exports.economicSector_list = async function (req, res) {
    res.status(200).json({
        sectors: Sectors.allSectors
    });
};

