const OurFormulary = require('../../../models/ourTest/OurFormulario');

exports.ourFormulary_list = async function(req, res){
    res.status(200).json({
        ourFormulary: await OurFormulary.pullDB()
    });
};