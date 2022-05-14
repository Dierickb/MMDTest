const connection = require('../../accessDB');
const ProcessSelected = require('../../models/minTicTest/ProcessSelected')
const AritmeticFunctions = require('../../common/aritmeticFunctions');

let DBMinTicTestController = function (businessName, idSector, idDimension, idQuestion, valueQuestion ) {
    this.businessName = businessName;
    this.idSector = idSector;
    this.idQuestion = idQuestion;
    this.valueQuestion = valueQuestion;
}

DBMinTicTestController.eliminarDiacriticos = function(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}
DBMinTicTestController.createElements = function (process) {
    return process.replace(/ /g, "_")
}

DBMinTicTestController.allAskResults = {};

// Pull data
DBMinTicTestController.allBusiness = async function () {
    return await connection.query(
        `   
            SELECT * FROM MINTIC_MODEL.business_name
        `
    )
        .catch((e) => {
            throw e;
        })
}
DBMinTicTestController.allBusinessInAsks = async function () {
    return await connection.query(
        `   
            SELECT id_business_name FROM MINTIC_MODEL.ask_results
            GROUP BY id_business_name
        `
    )
        .catch((e) => {
            throw e;
        })
}
DBMinTicTestController.pullAskResult = async function () {
    return await connection.query(
        `   
            SELECT askres.id_business_name, 
                busnam.tipo_empresa, temp.tipo_empresas, 
                ev.id_proceso, prcs.proceso,
                ev.id_eje_evaluacion, ejev.nombre_metodo,
                askres.value
            FROM MINTIC_MODEL.ask_results askres
            INNER JOIN MINTIC_MODEL.business_name busnam ON askres.id_business_name = busnam.id_business_name
            INNER JOIN MINTIC_MODEL.evaluacion ev ON askres.id_evaluacion = ev.id_evaluacion
            INNER JOIN MINTIC_MODEL.tipo_empresa temp ON busnam.tipo_empresa = temp.id_tipo_empresa
            INNER JOIN MINTIC_MODEL.procesos prcs ON ev.id_proceso = prcs.id_proceso  
            INNER JOIN MINTIC_MODEL.ejes_evaluacion ejev ON ev.id_eje_evaluacion = ejev.id_eje_evaluacion
         `
    )
    .catch((e) => {
        throw e;
    })
}
DBMinTicTestController.pullASKBySector = async function (idSector) {
    return await connection.query(
        `   
            SELECT askres.id_business_name, 
                busnam.tipo_empresa, temp.tipo_empresas, 
                ev.id_proceso, prcs.proceso,
                ev.id_eje_evaluacion, ejev.nombre_metodo,
                askres.value
            FROM MINTIC_MODEL.ask_results askres
            INNER JOIN MINTIC_MODEL.business_name busnam ON askres.id_business_name = busnam.id_business_name
            INNER JOIN MINTIC_MODEL.evaluacion ev ON askres.id_evaluacion = ev.id_evaluacion
            INNER JOIN MINTIC_MODEL.tipo_empresa temp ON busnam.tipo_empresa = temp.id_tipo_empresa
            INNER JOIN MINTIC_MODEL.procesos prcs ON ev.id_proceso = prcs.id_proceso  
            INNER JOIN MINTIC_MODEL.ejes_evaluacion ejev ON ev.id_eje_evaluacion = ejev.id_eje_evaluacion
            WHERE busnam.tipo_empresa = ${idSector}
         `
    )
    .catch((e) => {
        throw e;
    })
}

// Push
DBMinTicTestController.pushBusiness = async function (businessName, idSector) {
    idSector = parseInt(idSector);
    const [found, id] = await DBMinTicTestController.validateBusiness(businessName, idSector)
    
    if (!found) {
        const response = await connection.query(
            `   
                INSERT INTO MINTIC_MODEL.business_name (business_name, tipo_empresa)
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
DBMinTicTestController.pushAskResult = async function (idBusiness, askObject) {
    const found = await DBMinTicTestController.validateBusinessInAsks(idBusiness)
    const value = askObject.value; const questionId = askObject.idQuestion; let data = '';
    const insert = async (asks) => {
        connection.query(
            `INSERT INTO MINTIC_MODEL.ask_results (id_business_name, id_evaluacion, value) VALUES ${asks}`
        )
        .catch((e) => {
            throw e;
        });
    }
    for (let i =0; i< value.length -1; i++) {
        data = data.concat(`("${idBusiness}", "${questionId[i]}", "${value[i]}"), `);
    }    
    data = data.concat(`("${idBusiness}", "${questionId[value.length -1]}" , "${value[value.length -1]}");`) ;
    if (found) {
        await DBMinTicTestController.deleteBusinessInAskByBusiness(idBusiness)
        await insert(data)
    } else {
        await insert(data)
    }    
}
DBMinTicTestController.pushResultInfo = async function (results){
    resultByProcess = {};
    const askByProcess = await DBMinTicTestController.tagProcessSelected(results)

    resultByProcess["idSector"] = ProcessSelected.allProcessSelected.idSector;
    resultByProcess["sector"] = ProcessSelected.allProcessSelected.sector;

    for(property in askByProcess){
        let [summ, average] = AritmeticFunctions.prom(askByProcess[property].value);
        let varianze = AritmeticFunctions.varianze(average, askByProcess[property].value);
        resultByProcess[property] = {
            processName: askByProcess[property].processName,
            total: summ,
            average: average,
            cantN: askByProcess[property].value.length,
            varianze: varianze,
            standardDeviation: Math.pow(varianze, 1/2).toFixed(3)
        }
    }
    // Hacer push

    DBMinTicTestController.allAskResults = resultByProcess;
    return resultByProcess

}

// Delete
DBMinTicTestController.deleteBusinessById = async function(id) {
    const found = DBMinTicTestController.validateBusinessById(id)

    if (found) {
        await connection.query(
            ` DELETE FROM MINTIC_MODEL.ask_results WHERE id_business_name=${id};  `
        )
        .catch((e) => {
            throw e;
        });
    }

}
DBMinTicTestController.deleteBusinessInAskByBusiness = async function(idBusiness) {

    const found = await DBMinTicTestController.validateBusinessInAsks(idBusiness);
    
    if (found) {
        await connection.query(
            ` DELETE FROM MINTIC_MODEL.ask_results WHERE id_business_name=${idBusiness};  `
        )
        .catch((e) => {
            throw e;
        });
    } else {
        throw new Error("This business id does not exist")
    }
}

// Validations
DBMinTicTestController.validateBusinessById = async function (id) {
    const businessDB = await DBMinTicTestController.allBusiness()
    let found = false;

    for ( let element of businessDB ) {
        if ( element.id_business_name === id) {
            found = true ;
        }
    }
    return found
}
DBMinTicTestController.validateBusiness = async function (business, idSector) {
    const businessDB = await DBMinTicTestController.allBusiness()
    let found = false; let id;
    if (businessDB.length !== 0) {
        for ( let element of businessDB ) {
            if ( element.business_name === business && element.tipo_empresa === idSector) {
                found = true;
                id = element.id_business_name;
                return [found, id]
            }
        }
    }
    
    id = null;
    return [found, id]
    
}
DBMinTicTestController.validateBusinessInAsks = async function (idBusiness) {
    const response = await DBMinTicTestController.allBusinessInAsks();
    let idBusinessFound = false;
    for ( let property of response ){
        if (idBusiness === property.id_business_name) {
            idBusinessFound = true;
            return idBusinessFound
        }
    }
    return idBusinessFound
    
}

// Refactor data
DBMinTicTestController.tagProcessSelected = async function (asks) {
    let j = 0; let askByProcess = {}; let = []; let object = ""; let value = []; let idQuestion = [];
    let process = [];

    for (let i = 0; i < ProcessSelected.allProcessSelected.processId.length ; i++ ){
        let tagProcess = DBMinTicTestController.eliminarDiacriticos(ProcessSelected.allProcessSelected.process[i])
        process[ProcessSelected.allProcessSelected.processId[i]] = {
            tagProcess: DBMinTicTestController.createElements(tagProcess),
            processName: ProcessSelected.allProcessSelected.process[0]
        }
    }

    /*
        askByProcess: {
            process_1: {
                id: number,
                process: string,
                value: number[],
                idQuestion: number[]
            }
            ..
            ..
            ..
            process_n: {
                id: number,
                process: string,
                value: number[],
                idQuestion: number[]
            }
        }
    */
    for (let i = 0; i < asks.value.length; i++) {
        if (process[asks.process[i]].tagProcess !== object) {

            value = []; idQuestion = []; j = 0;
            askByProcess[process[asks.process[i]].tagProcess] = { }
            value[j] = asks.value[i];
            idQuestion[j] = asks.idQuestion[i];
            object = process[asks.process[i]].tagProcess;

            askByProcess[process[asks.process[i]].tagProcess] = {
                id: asks.process[i],
                processName: process[asks.process[i]].processName,
                value: value,
                idQuestion: idQuestion,
            }
            j = j + 1;
        } else { 
            
            value[j] = asks.value[i];
            idQuestion[j] = asks.idQuestion[i];
            
            askByProcess[process[asks.process[i]].tagProcess] = {
                id: asks.process[i],
                processName: process[asks.process[i]].processName,
                value: value,
                idQuestion: idQuestion,
            }
            j = j + 1;
        }
        
    }

    return askByProcess

}


module.exports = DBMinTicTestController;