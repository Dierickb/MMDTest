const DBMinTicTestController = require('../../controller/minTic/DBMinTicTest.controller')

const FilterBySector = function (idEconomicSector, economicSector, idProcess, process) {
    this.idEconomicSector = idEconomicSector;
    this.idProcess = idProcess;
    this.process = process;
    this.economicSector = economicSector;
}

FilterBySector.prototype.toString = function () {
    return 'sector: ' + this.sector + ' | id_sector: ' + this.idSector;
}

FilterBySector.toNumber = function (id) {
    return parseInt(id);
}

FilterBySector.allFilterBySector = {
    sectorId: 0,
    sector: '',
    processId: [],
    process: [],
    length: 0
}

FilterBySector.add = function (allFilterBySector) {
    FilterBySector.allFilterBySector.sector = allFilterBySector.sector;
    FilterBySector.allFilterBySector.sectorId = allFilterBySector.sectorId;
    FilterBySector.allFilterBySector.processId = allFilterBySector.processId;
    FilterBySector.allFilterBySector.process = allFilterBySector.process;
    FilterBySector.allFilterBySector.length = allFilterBySector.length;
}

FilterBySector.clean = async function () {
    FilterBySector.allFilterBySector.length = 0
}

FilterBySector.pullDB = async function (idFilterBySector) {
    const id = FilterBySector.toNumber(idFilterBySector);
    FilterBySector.clean()
    const sectorProcess = await DBMinTicTestController.pullFilterProcessBySector(idFilterBySector)

    FilterBySector.add(sectorProcess)
}

module.exports = FilterBySector;