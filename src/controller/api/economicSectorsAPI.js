var Sectors = require('../../models/economicSector');

exports.economicSector_list = function (req, res) {
    res.status(200).json({
        sectors: Sectors.allSectors   
    });
};

