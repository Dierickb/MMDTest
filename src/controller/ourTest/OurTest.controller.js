const connection = require('../../accessDB');
const ProcessSelected = require('../../models/minTicTest/ProcessSelected')
const AritmeticFunctions = require('../../common/aritmeticFunctions');
let id_sector;

let OurTestController = function (bussisness, idSector, idDimension, idQuestion, valueQuestion ) {
    this.bussisness = bussisness;
    this.idSector = idSector;
    this.idDimension = idDimension;
    this.idQuestion = idQuestion;
    this.valueQuestion = valueQuestion;
}

OurTestController.eliminarDiacriticos = function(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}
OurTestController.createElements = function (process) {
    return process.replace(/ /g, "_")
}

// Pull data
OurTestController.pullAllOurTest = async function () {
    const response = await connection
        .query(`SELECT * FROM pf.dimension`)
        .catch((e) => {
            throw e;
        });
    return response
            
}
OurTestController.allBussisness = async function () {
    const response = await connection.query(
        `   
            SELECT * FROM pf.businesses
        `
    )
    .catch((e) => {
        throw e;
    });
    return response
}
OurTestController.allBussisnessInAsks = async function () {
    const response = await connection.query(
        `   
            SELECT idbusinesses FROM pf.asksresults
            GROUP BY idbusinesses
        `
    )
    .catch((e) => {
        throw e;
    });
    return response
}
OurTestController.pullAllDimensions = async function () {
    const response = await connection
        .query(`SELECT * FROM pf.dimension`)
        .catch((e) => {
            throw e;
        });
        
    return await Dimension.add(response)
}
OurTestController.pullAxesByDimension = async function () {
    const response = await connection
        .query(
            `   
                SELECT form.idquestion, dim.dimension, dim.iddimension, form.question, form.question
                FROM pf.formulary form
                INNER JOIN pf.dimension dim ON form.iddimension = dim.iddimension
            `
        )
        .catch((e) => {
            throw e;
        });
    return response
}
OurTestController.pullBusinessInAskResultStadistic = async function () {
    const response = await connection.query(
        `   
            SELECT id_business FROM pf.ask_result_stadistic
            GROUP BY id_business
        `
    )
    .catch((e) => {
        throw e;
    });
    return response
}
OurTestController.pullEvaluationAxes = async function () {
    const response = await connection
        .query(
            `   
                SELECT form.idformulary, dim.dimension, dim.iddimension, form.question, form.info_question
                FROM pf.formulary form
                INNER JOIN pf.dimension dim ON form.iddimension = dim.iddimension
            `
        )
        .catch((e) => {
            throw e;
        });
    return response
}

OurTestController.allDimensions = [];
OurTestController.askByDimension = {};
OurTestController.idSector = [];

// Push
OurTestController.pushBusiness = async function (businessName, idSector) {
    idSector = parseInt(idSector);
    id_sector = idSector;
    const [found, id] = await OurTestController.validateBusiness(businessName, idSector)
    let response
    
    if (!found) {
        response = await connection.query(
            `   
                INSERT INTO pf.businesses (businesses, id_sector)
                VALUES ("${businessName}", ${idSector});
            `
        )
        .catch((e) => {
            throw e;
        });        
        return response.insertId
    } else {
        return id;
    }
}
OurTestController.pushAskResult = async function (idbusiness, askObject) {
    const found = await OurTestController.validateBusinessInAsks(idbusiness)
    const value = askObject.value; const questionId = askObject.idQuestion; let data = '';
    const insert = async (asks) => {
        connection.query(
            `INSERT INTO pf.asksresults (idbusinesses, value, idquestion) VALUES ${asks}`
        )
        .catch((e) => {
            throw e;
        });
    }
    for (let i =0; i< value.length -1; i++) {
        data = data.concat(`("${idbusiness}", "${value[i]}", "${questionId[i]}" ), `);
    }    
    data = data.concat(`("${idbusiness}", "${value[value.length -1]}", "${questionId[value.length -1]}" ); `) ;
    if (found) {
        await OurTestController.deleteBusinessInAskByBusiness(idbusiness)
        await insert(data)
    } else {
        await insert(data)
    }    
}
OurTestController.pushAskResultInfo = async function (resultOurTest, idBusiness) {
    const result = await OurTestController.tagDimension(resultOurTest);
    const askByDimension = OurTestController.resultByDimension(result, idBusiness);
    const found = await OurTestController.validateBusinessInAskResultStadistic(idBusiness)
    let data = ''; let i = 0;
    
    const insert = async (asks) => {
        connection.query(
            `
                INSERT INTO pf.ask_result_stadistic
                    (id_business, id_sector, id_dimension, average, total, varianze, standardDeviation, cantN) 
                VALUES 
                    ${asks}
            `
        )
        .catch((e) => {
            throw e;
        });
    }
    objectLength = Object.keys(askByDimension).length - 3;

    for (property in askByDimension) {        
        if (property !== "idSector" && property !== "sector" && property !== "idBusiness" && i< objectLength-1) {
            object = askByDimension[property];
            data = data.concat(`("${askByDimension.idBusiness}", "${askByDimension.idSector}", "${object.dimensionId}", "${object.average}", "${object.total}", "${object.varianze}", "${object.standardDeviation}", "${object.cantN}"  ), `);
            i=i+1;
        } else if (property !== "idSector" && property !== "sector" && property !== "idBusiness" && i === objectLength-1) {
            object = askByDimension[property];
            data = data.concat(`("${askByDimension.idBusiness}", "${askByDimension.idSector}", "${object.dimensionId}", "${object.average}", "${object.total}", "${object.varianze}", "${object.standardDeviation}", "${object.cantN}"  ); `);
        }
    }
    
    if (found) {
        await OurTestController.deleteBusinessInAskResultStadistic(idBusiness)
        await insert(data)
    } else {
        await insert(data)
    }
    
    OurTestController.askByDimension = askByDimension;
}

// Delete
OurTestController.deleteBusinessById = async function(id) {
    OurTestController.validateBusinessById(id)

    await connection.query(
        ` DELETE FROM pf.asksresults WHERE idbusinesses=${id};  `
    )
    .catch((e) => {
        throw e;
    });

}
OurTestController.deleteBusinessInAskByBusiness = async function(idBusiness) {

    const found = await OurTestController.validateBusinessInAsks(idBusiness);
    
    if (found) {
        await connection.query(
            ` DELETE FROM pf.asksresults WHERE idbusinesses=${idBusiness};  `
        )
        .catch((e) => {
            throw e;
        });
    } else {
        throw new Error("This business id does not exist")
    }
}
OurTestController.deleteBusinessInAskResultStadistic = async function(idBusiness) {
    const found = await OurTestController.validateBusinessInAskResultStadistic(idBusiness);
    if (found) {
        await connection.query(
            ` DELETE FROM pf.ask_result_stadistic WHERE id_business=${idBusiness}; `
        )
        .catch((e) => {
            throw e;
        });
    } else {
        throw new Error("This business id does not exist")
    }
}

// Validations
OurTestController.validateBusinessById = async function (id) {
    const businessDB = await OurTestController.allBussisness()
    let found = false;

    for ( element of businessDB ) {
        if ( element.idbusinesses === id) {
            found = true ;
        }
    }
    return found
}
OurTestController.validateBusiness = async function (business, idSector) {
    const businessDB = await OurTestController.allBussisness()
    let found = false; let id = 0;
    for ( let element of businessDB ) {
        if ( element.businesses === business && element.id_sector === idSector) {
            found = true;
            id = element.idbusinesses
            return [found, id]
        }
    }
    id = null;
    return [found, id]
}
OurTestController.validateBusinessInAsks = async function (idBusiness) {
    const response = await OurTestController.allBussisnessInAsks();
    let idBusinessFound = false;
    for ( let property of response ){
        if (idBusiness === property.idbusinesses) {
            idBusinessFound = true;
            return idBusinessFound
        }
    }
    return idBusinessFound
    
}
OurTestController.validateBusinessInAskResultStadistic = async function (idBusiness) {
    const result = await OurTestController.pullBusinessInAskResultStadistic();
    let idBusinessFound = false;
    for ( let property of result ){
        if (idBusiness === property.id_business) {
            idBusinessFound = true;
            return idBusinessFound
        }
    }
    return idBusinessFound
}

// Refactor
OurTestController.createArrayDimension = async function(dimension) {
    
    let dimensions = [];
    for ( property in dimension ) {
        dimensions[dimension[property].dimensionId] = dimension[property].dimension;        
    }

    OurTestController.allDimensions = dimensions;
}
OurTestController.tagDimension = function (results) {
    let i = 0; let dimension = {}; let object = 0; let j = 0; let tagDimension;
    for (element of results.process) {
        if (element !== object){      
            value = []; idQuestion = []; j = 0;

            tagDimension = OurTestController.allDimensions[element];
            tagDimension = OurTestController.eliminarDiacriticos(tagDimension);
            tagDimension = OurTestController.createElements(tagDimension);

            value[j] = results.value[i];
            idQuestion[j] = results.idQuestion[i];

            dimension[tagDimension] = {
                dimensionId: element,
                dimension: OurTestController.allDimensions[element],
                idQuestion: idQuestion,
                value: value,
            };
            j = j + 1;
            object = element;
        } else {
            value[j] = results.value[i];
            idQuestion[j] = results.idQuestion[i];

            dimension[tagDimension] = {
                dimensionId: element,
                dimension: OurTestController.allDimensions[element],
                idQuestion: idQuestion,
                value: value,
            };
            j = j + 1;

        }
        i = i + 1;
    }
    return dimension
}
OurTestController.resultByDimension = function (result, id_business) {
    let askByDimension = {};
    askByDimension["idSector"] = id_sector;
    askByDimension["sector"] = OurTestController.idSector[id_sector];
    askByDimension["idBusiness"] = id_business;
    for( property in result ) {
        let [summ, average] = AritmeticFunctions.prom(result[property].value);
        let varianze = AritmeticFunctions.varianze(average, result[property].value);

        askByDimension[property] = {
            dimensionId: result[property].dimensionId,
            dimension: result[property].dimension,
            total: summ,
            average: average,
            cantN: result[property].value.length,
            varianze: varianze,
            standardDeviation: parseFloat(Math.pow(varianze, 1/2).toFixed(3))
        }
    }
    return askByDimension
}

module.exports = OurTestController;