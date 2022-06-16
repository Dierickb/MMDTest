const connection = require('../../accessDB');

let OurTestResultController = function (idSector, idQuestion, average, total) {
    this.idSector = idSector;
    this.idQuestion = idQuestion;
    this.average = average;
    this.total = total
}
OurTestResultController.eliminarDiacriticos = async function (texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}
OurTestResultController.createElements = async function (process) {
    return process.replace(/ /g, "_")
}

// Pull data
OurTestResultController.pullSector = async function () {
    return await connection.query(
        ` SELECT idSector, sector FROM pf.economic_sector `
    )
        .catch((e) => {
            throw e;
        })
}

OurTestResultController.pullResultBySector = async function (idSector) {
    //const found = await DBMinTicTestResultController.validateSector(idSector)
    const found = true;
    if (found) {
        const response = await connection.query(
            `   
                SELECT askres.id_sector, sect.sector,
                askres.id_dimension, dim.dimension,
                askres.total, askres.average, askres.standardDeviation, askres.cantN
                FROM pf.ask_result_stadistic askres
                INNER JOIN pf.economic_sector sect ON askres.id_sector = sect.idsector
                INNER JOIN pf.dimension dim ON askres.id_dimension = dim.iddimension
                WHERE askres.id_sector = ${idSector}
                
             `
        )
            .catch((e) => {
                throw e;
            })

        const tagDimension = OurTestResultController.tagDimension(response)
        return tagDimension
    } else {
        throw new Error("The id sector does not exist")
    }
}

// Refactor
OurTestResultController.tagDimension = async function (data) {
    let object = ""; let datos = {}; let tagProcess; let datos_2 = {};

    for (let property of data) {

        if (property.proceso !== object) {
            const dataKey = Object.keys(datos_2);

            const found = dataKey.find(element => element === `${property.dimension}`);

            tagProcess = await OurTestResultController.eliminarDiacriticos(property.dimension);
            tagProcess = await OurTestResultController.createElements(tagProcess);

            if (found === undefined) {
                datos_2[tagProcess] = {
                    dimensionId: 0,
                    dimension: "",
                    average: [],
                    total: [],
                    standardDeviation: [],
                    cantN: [],
                }
            }

            datos_2[tagProcess].dimensionId = property.id_dimension;
            datos_2[tagProcess].dimension = property.dimension;

            datos_2[tagProcess].average.push(property.average)
            datos_2[tagProcess].total.push(property.total)
            datos_2[tagProcess].standardDeviation.push(property.standardDeviation)
            datos_2[tagProcess].cantN.push(property.cantN)
        } else {
            datos_2[tagProcess].dimensionId = property.id_dimension;
            datos_2[tagProcess].dimension = property.dimension;

            datos_2[tagProcess].average.push(property.average)
            datos_2[tagProcess].total.push(property.total)
            datos_2[tagProcess].standardDeviation.push(property.standardDeviation)
            datos_2[tagProcess].cantN.push(property.cantN)
        }
    }
    return datos_2
}


// Validate
OurTestResultController.validateSector = async function (idSector) {
    const sectorId = await OurTestResultController.pullSector(idSector);
    let idSectorFound = false;
    for (let property of sectorId) {
        if (idSector === property.id_sector) {
            idSectorFound = true;
            return idSectorFound
        }
    }
    return idSectorFound
}


module.exports = OurTestResultController;