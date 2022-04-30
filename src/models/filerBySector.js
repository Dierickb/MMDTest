const connection = require('../accessDB')

let FilterBySector = function (idEvaluation, idEconomicSector, idProcess, process, economicSector) {
    this.idEvaluation = idEvaluation;
    this.idEconomicSector = idEconomicSector;
    this.idProcess = idProcess;
    this.process = process;
    this.economicSector = economicSector;
}

FilterBySector.prototype.toString = function () {
    return 'sector: ' + this.sector + ' | id_sector: ' + this.idSector;
}

FilterBySector.toNumber = function (id) {
    return Number(id);
}

FilterBySector.allFilterBySector = []

FilterBySector.add = function (allFilterBySector) {
    FilterBySector.allFilterBySector.push(allFilterBySector);
}

FilterBySector.finById = function (aFilterBySectorId) {
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

FilterBySector.pullDB = function (idFilterBySector) {
    const id = FilterBySector.toNumber(idFilterBySector)

    connection.query(
        `
            SELECT tep.id_tipo_empresas, te.tipo_empresas, tep.id_proceso, p.proceso
            FROM MINTIC_MODEL.tipo_empresa_proceso tep
            INNER JOIN MINTIC_MODEL.tipo_empresa te ON tep.id_tipo_empresas = te.id_tipo_empresa
            INNER JOIN MINTIC_MODEL.procesos p ON tep.id_proceso = p.id_proceso
            WHERE tep.id_tipo_empresas="${id}"
        `,
        (err, results, fields) => {
            if (err) throw err;
            for (let value of results) {
                FilterBySector.add(value)
            }
        }
    )
}

module.exports = FilterBySector;