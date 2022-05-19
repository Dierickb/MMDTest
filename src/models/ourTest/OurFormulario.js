const connection = require('../../accessDB')
const DBMinTicTestController = require('../../controller/minTic/DBMinTicTest.controller')

let OurFormulary = function (idDimensions, dimensions) {
    this.idDimensions = idDimensions;
    this.dimensions = dimensions;
}

OurFormulary.pullDB = async function () {
    return await DBMinTicTestController.pullProcessBySector()
}


