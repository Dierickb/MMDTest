const connection = require('../../accessDB');

let DBMinTicTestResultController = function ( idSector, idQuestion, valueQuestion ) {
    this.idSector = idSector;
    this.idQuestion = idQuestion;
    this.valueQuestion = valueQuestion;
}
DBMinTicTestResultController.eliminarDiacriticos = async function(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}
DBMinTicTestResultController.createElements = async function (process) {
    return process.replace(/ /g, "_")
}

DBMinTicTestResultController.allDimension = [];
DBMinTicTestResultController.resultBySector = {};

// Pull data
DBMinTicTestResultController.pullSector = async function () {
    return await connection.query(
        ` SELECT id_tipo_empresa, tipo_empresas FROM MINTIC_MODEL.tipo_empresa `
    )
    .catch((e) => {
        throw e;
    })
}
DBMinTicTestResultController.pullResultBySector = async function (idSector) {
    const found = await DBMinTicTestResultController.validateSector(idSector)

    if (found) {
        const response = await connection.query(
            `   
                SELECT askres.id_sector, temp.tipo_empresas, 
                askres.id_process, prc.proceso,
                askres.average, askres.total, askres.varianze, askres.standardDeviation, askres.cantN
                FROM MINTIC_MODEL.ask_result_stadistic askres
                INNER JOIN MINTIC_MODEL.tipo_empresa temp ON askres.id_sector = temp.id_tipo_empresa
                INNER JOIN MINTIC_MODEL.procesos prc ON askres.id_process = prc.id_proceso
                WHERE askres.id_sector = ${idSector}
             `
        )
        .catch((e) => {
            throw e;
        })

        const tagProcess = DBMinTicTestResultController.tagProcess(response)        
        return tagProcess
    } else {
        throw new Error("The id sector does not exist")
    }
}

// Validate
DBMinTicTestResultController.validateSector = async function (idSector) {
    const sectorId = await DBMinTicTestResultController.pullSector(idSector);
    let idSectorFound = false;
    for ( let property of sectorId ){
        if (idSector === property.id_tipo_empresa) {
            idSectorFound = true;
            return idSectorFound
        }
    }
    return idSectorFound
}

// Refactor
DBMinTicTestResultController.tagProcess = async function (data) {
    let i = 0; let average = []; let total = []; let standardDeviation = []; 
    let cantN = []; let object = ""; let datos = {}; let tagProcess;
    
    for (let property of data) {
        datos["sectorId"] = property.id_sector;
        datos["sector"] = property.tipo_empresas;
        if (property.proceso !== object) {
            
            tagProcess = await DBMinTicTestResultController.eliminarDiacriticos(property.proceso);
            tagProcess = await DBMinTicTestResultController.createElements(tagProcess);

            average[i] = property.average;
            total[i] = property.total;
            standardDeviation[i] = property.standardDeviation;
            cantN[i] = property.cantN;
            
            datos[tagProcess] = {
                idProcess: property.id_process,
                average: average,
                total: total,
                standardDeviation: standardDeviation,
                cantN: cantN,
            }
            object = property.proceso;
        } else {
            average[i] = property.average;
            total[i] = property.total;
            standardDeviation[i] = property.standardDeviation;
            cantN[i] = property.cantN;
            datos[tagProcess] = {
                idProcess: property.id_process,
                average: average,
                total: total,
                standardDeviation: standardDeviation,
                cantN: cantN,
            }
        }
        i = i + 1;
    }
    DBMinTicTestResultController.resultBySector = datos;
    return datos
}

module.exports = DBMinTicTestResultController