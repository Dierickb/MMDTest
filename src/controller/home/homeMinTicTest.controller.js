const connection = require('../../accessDB');

let DBMinTicTestResultController = function (idSector, idQuestion, valueQuestion) {
    this.idSector = idSector;
    this.idQuestion = idQuestion;
    this.valueQuestion = valueQuestion;
}
DBMinTicTestResultController.eliminarDiacriticos = async function (texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
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
    for (let property of sectorId) {
        if (idSector === property.id_tipo_empresa) {
            idSectorFound = true;
            return idSectorFound
        }
    }
    return idSectorFound
}

// Refactor
DBMinTicTestResultController.tagProcess = async function (data) {
    let object = ""; let datos = {}; let tagProcess; let datos_2 = {};

    for (let property of data) {
        datos_2["sectorId"] = property.id_sector;
        datos_2["sector"] = property.tipo_empresas;
        
        if (property.proceso !== object) {
            const dataKey = Object.keys(datos_2);
            const found = dataKey.find(element => element === `${property.proceso}`);

            tagProcess = await DBMinTicTestResultController.eliminarDiacriticos(property.proceso);
            tagProcess = await DBMinTicTestResultController.createElements(tagProcess);

            if ( found === undefined ) {
                datos_2[tagProcess] = {
                    idProcess: 0,
                    process: "",
                    average: [],
                    total: [],
                    standardDeviation: [],
                    cantN: [],
                }
            }            

            datos_2[tagProcess].idProcess = property.id_process;
            datos_2[tagProcess].process = property.proceso;

            datos_2[tagProcess].average.push(property.average)
            datos_2[tagProcess].total.push(property.total)
            datos_2[tagProcess].standardDeviation.push(property.standardDeviation)
            datos_2[tagProcess].cantN.push(property.cantN)
            object = property.proceso;
        } else {
            datos_2[tagProcess].average.push(property.average)
            datos_2[tagProcess].total.push(property.total)
            datos_2[tagProcess].standardDeviation.push(property.standardDeviation)
            datos_2[tagProcess].cantN.push(property.cantN)
        }
    }
    DBMinTicTestResultController.resultBySector = datos;
    return datos_2
}

module.exports = DBMinTicTestResultController