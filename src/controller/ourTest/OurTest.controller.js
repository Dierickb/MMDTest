const connection = require('../../accessDB');
const ArithmeticFunctions = require('../../common/aritmeticFunctions');
const Dimension = require("../../models/ourTest/Dimension");
let id_sector;

let OurTestController = function (business, idSector, idDimension, idQuestion ) {
    this.idSector = idSector;
    this.idQuestion = idQuestion;
}

OurTestController.removeDiacritics = function(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}
OurTestController.createElements = function (process) {
    return process.replace(/ /g, "_")
}

// Pull data
OurTestController.pullAllOurTest = async function () {
    return await connection.query(`SELECT * FROM pf.dimension`)
        .catch((e) => {
            throw e;
        })
}
OurTestController.allBusiness = async function () {
    return await connection.query(`SELECT * FROM pf.business`)
        .catch((e) => {
            throw e;
        })
}
OurTestController.allBusinessInAsks = async function () {
    return await connection.query(
            `   
                SELECT idbusinesses FROM pf.ask_results
                GROUP BY idbusinesses
            `
        )
        .catch((e) => {
            throw e;
        })
}
OurTestController.pullAllDimensions = async function () {
    const response = await connection.query(`SELECT *FROM pf.dimension`)
        .catch((e) => {
            throw e;
        });
        
    return await Dimension.add(response)
}
OurTestController.pullAxesByDimension = async function () {
    return await connection.query(
            `   
                SELECT dim.dimension, dim.iddimension, form.question, form.question
                FROM pf.formulary form
                INNER JOIN pf.dimension dim ON form.iddimension = dim.iddimension
            `
        )
        .catch((e) => {
            throw e;
        })
}
OurTestController.pullBusinessInAskResultStatistic = async function () {
    return await connection.query(
            `   
                SELECT id_business FROM pf.ask_result_stadistic
                GROUP BY id_business
            `
        )
        .catch((e) => {
            throw e;
        })
}
OurTestController.pullEvaluationAxes = async function () {
    return await connection.query(
            `   
                SELECT form.idformulary, dim.dimension, dim.iddimension, form.question, form.info_question
                FROM pf.formulary form
                INNER JOIN pf.dimension dim ON form.iddimension = dim.iddimension
            `
        )
        .catch((e) => {
            throw e;
        });
}
OurTestController.pullCriterionByDimension = async function (dimensionId, level) {
    return await connection.query(
            `   
                SELECT dim.dimension, cri.nivel, cri.question
                FROM pf.criterios cri
                INNER JOIN pf.dimension dim ON cri.iddimension = dim.iddimension
                WHERE cri.iddimension = ${dimensionId} AND cri.nivel = ${level}
            `
        )
        .catch((e) => {
            throw e;
        })
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
                INSERT INTO pf.business (businesses, id_sector)
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
OurTestController.pushAskResult = async function (id_business, askObject) {
    const found = await OurTestController.validateBusinessInAsks(id_business)
    const value = askObject.value; const questionId = askObject.idQuestion; let data = '';
    const insert = async (asks) => {
        connection.query(
            `INSERT INTO pf.ask_results (idbusinesses, value, idquestion) VALUES ${asks}`
        )
        .catch((e) => {
            throw e;
        });
    }
    for (let i =0; i< value.length -1; i++) {
        data = data.concat(`("${id_business}", "${value[i]}", "${questionId[i]}" ), `);
    }    
    data = data.concat(`("${id_business}", "${value[value.length -1]}", "${questionId[value.length -1]}" ); `) ;
    if (found) {
        await OurTestController.deleteBusinessInAskByBusiness(id_business)
        await insert(data)
    } else {
        await insert(data)
    }    
}
OurTestController.pushAskResultInfo = async function (resultOurTest, idBusiness) {

    const result = OurTestController.tagDimension(resultOurTest);
    const askByDimension = OurTestController.resultByDimension(result, idBusiness);
    const found = await OurTestController.validateBusinessInAskResultStatistic(idBusiness)
    let data = ''; let i = 0; let object;
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
    let objectLength = Object.keys(askByDimension).length - 3;

    for (let property in askByDimension) {
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
        await OurTestController.deleteBusinessInAskResultStatistic(idBusiness)
        await insert(data)
    } else {
        await insert(data)
    }
    
    OurTestController.askByDimension = askByDimension;
}

// Delete
OurTestController.deleteBusinessById = async function(id) {
    await OurTestController.validateBusinessById(id)

    await connection.query(
        ` DELETE FROM pf.ask_results WHERE idbusinesses=${id};  `
    )
    .catch((e) => {
        throw e;
    });

}
OurTestController.deleteBusinessInAskByBusiness = async function(idBusiness) {

    const found = await OurTestController.validateBusinessInAsks(idBusiness);
    
    if (found) {
        await connection.query(
            ` DELETE FROM pf.ask_results WHERE idbusinesses=${idBusiness};  `
        )
        .catch((e) => {
            throw e;
        });
    } else {
        throw new Error("This business id does not exist")
    }
}
OurTestController.deleteBusinessInAskResultStatistic = async function(idBusiness) {
    const found = await OurTestController.validateBusinessInAskResultStatistic(idBusiness);
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
    const businessDB = await OurTestController.allBusiness()
    let found = false;

    for ( let element of businessDB ) {
        if ( element.idbusinesses === id) {
            found = true ;
        }
    }
    return found
}
OurTestController.validateBusiness = async function (business, idSector) {
    const businessDB = await OurTestController.allBusiness()
    let found = false; let id;
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
    const response = await OurTestController.allBusinessInAsks();
    let idBusinessFound = false;
    for ( let property of response ){
        if (idBusiness === property.idbusinesses) {
            idBusinessFound = true;
            return idBusinessFound
        }
    }
    return idBusinessFound
    
}
OurTestController.validateBusinessInAskResultStatistic = async function (idBusiness) {
    const result = await OurTestController.pullBusinessInAskResultStatistic();
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
    for ( let property in dimension ) {
        dimensions[dimension[property].dimensionId] = dimension[property].dimension;        
    }

    OurTestController.allDimensions = dimensions;
}
OurTestController.tagDimension = function (results) {
    let i = 0; let dimension = {}; let object = 0; let tagDimension;
    let value = []; let idQuestion = [];

    for (let element of results.process) {
        if (element !== object){      
            value = []; idQuestion = [];

            tagDimension = OurTestController.removeDiacritics(OurTestController.allDimensions[element]);
            tagDimension = OurTestController.createElements(tagDimension);
            console.log(tagDimension)
            object = element;
        }
        value.push(results.value[i])
        idQuestion.push(results.idQuestion[i]);

        dimension[tagDimension] = {
            dimensionId: element,
            dimension: OurTestController.allDimensions[element],
            idQuestion: idQuestion,
            value: value,
        };
        i = i + 1;
    }
    return dimension
}
OurTestController.resultByDimension = function (result, id_business) {
    let askByDimension = {};
    askByDimension["idSector"] = id_sector;
    askByDimension["sector"] = OurTestController.idSector[id_sector];
    askByDimension["idBusiness"] = id_business;

    for( let property in result ) {
        let [sum, average] = ArithmeticFunctions.prom(result[property].value);
        let variance = ArithmeticFunctions.varianze(average, result[property].value);

        askByDimension[property] = {
            dimensionId: result[property].dimensionId,
            dimension: result[property].dimension,
            total: sum,
            average: average,
            cantN: result[property].value.length,
            variance: variance,
            standardDeviation: parseFloat(Math.pow(variance, 1/2).toFixed(3))
        }
    }
    return askByDimension
}

module.exports = OurTestController;