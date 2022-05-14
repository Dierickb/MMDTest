const connection = require('../../accessDB')

let FilterBySector = function (idEconomicSector, economicSector, idProcess, process) {
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
    const id = FilterBySector.toNumber(idFilterBySector); let i = 0;
    FilterBySector.clean()
    const response = await connection
        .query(
            `   
                SELECT tep.id_tipo_empresas, te.tipo_empresas, tep.id_proceso, p.proceso
                FROM MINTIC_MODEL.tipo_empresa_proceso tep
                INNER JOIN MINTIC_MODEL.tipo_empresa te ON tep.id_tipo_empresas = te.id_tipo_empresa
                INNER JOIN MINTIC_MODEL.procesos p ON tep.id_proceso = p.id_proceso
                WHERE tep.id_tipo_empresas="${id}"
            `
        )
        .catch((e) => {
            throw e;
        });

    let sectorProcess = {
        sectorId: id,
        sector: response[0].tipo_empresas,
        processId: [],
        process: [],
        length: response.length
    }

    for (let value of response) {
        sectorProcess.processId[i] = value.id_proceso;
        sectorProcess.process[i] = value.proceso;
        i = i + 1;
    }

    FilterBySector.add(sectorProcess)
}

module.exports = FilterBySector;




/*
FilterBySector.finSectorById = function (aFilterBySectorId) {
    var aFilterBySector = FilterBySector.aFilterBySector.find(x => x.idSector == aFilterBySectorId);
    if (aFilterBySector)
        return aFilterBySector
    else
        throw new Error(`No existe un sector economico con el id ${aFilterBySectorId}`);
};


FilterBySector.removeById = function (aSectorId) {
    for (let i = 0; i < FilterBySector.allFilterBySector.length; i++) {
        if (FilterBySector.allFilterBySector[i].id == aSectorId) {
            FilterBySector.allFilterBySector.splice(i, 1);
            break;
        };
    };
};
*/
