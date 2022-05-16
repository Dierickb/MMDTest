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
DBMinTicTestController.pullAxesByProcess = async function (idProcess) {
    let data = ''
    for (let i = 0; i < idProcess.length; i++) {
        if (i === 0) {
            data = data.concat(' ', `WHERE ev.id_proceso = "${idProcess[i]}"`)
        } else {
            data = data.concat(' ', `OR ev.id_proceso = "${idProcess[i]}"`)
        }
    }
    const response = await connection
        .query(
            `   
                    SELECT ev.id_evaluacion, ev.id_eje_evaluacion, ejev.nombre_metodo,  ev.id_proceso, p.proceso
                    FROM MINTIC_MODEL.evaluacion ev
                    INNER JOIN MINTIC_MODEL.ejes_evaluacion ejev ON ev.id_eje_evaluacion = ejev.id_eje_evaluacion
                    INNER JOIN MINTIC_MODEL.procesos p ON ev.id_proceso = p.id_proceso
                    ${data}
                `
        )
        .catch((e) => {
            throw e;
        });

    return response
}
DBMinTicTestController.pullFilterProcessBySector = async function (idSector) {
    const id = parseInt(idSector); let i = 0;
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

    return sectorProcess
}
DBMinTicTestController.pullAllAskResultStadistic = async function () {
    return await connection.query(
        `   
            SELECT id_business FROM MINTIC_MODEL.ask_result_stadistic
            GROUP BY id_business
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
DBMinTicTestController.pushResultInfo = async function (results, idBusiness){
    const askByProcess = DBMinTicTestController.tagProcessSelected(results);
    const resultByProcess = DBMinTicTestController.resultByProcess(askByProcess, idBusiness);
    let data = ''; let i = 0;

    const insert = async (asks) => {
        connection.query(
            `
                INSERT INTO MINTIC_MODEL.ask_result_stadistic
                    (id_business, id_sector, id_process, average, total, varianze, standardDeviation, cantN) 
                VALUES 
                    ${asks}
            `
        )
        .catch((e) => {
            throw e;
        });
    }
    objectLength = Object.keys(resultByProcess).length - 3;
    for (property in resultByProcess) {        
        if (property !== "idSector" && property !== "sector" && property !== "idBusiness" && i< objectLength-1) {
            object = resultByProcess[property];
            data = data.concat(`("${resultByProcess.idBusiness}", "${resultByProcess.idSector}", "${object.processId}", "${object.average}", "${object.total}", "${object.varianze}", "${object.standardDeviation}", "${object.cantN}"  ), `);
            i=i+1;
        } else if (property !== "idSector" && property !== "sector" && property !== "idBusiness" && i === objectLength-1) {
            object = resultByProcess[property];
            data = data.concat(`("${resultByProcess.idBusiness}", "${resultByProcess.idSector}", "${object.processId}", "${object.average}", "${object.total}", "${object.varianze}", "${object.standardDeviation}", "${object.cantN}"  ); `);
        }
    }
    
    const found = await DBMinTicTestController.validateBusinessInAskResultStadistic(idBusiness)
     
    
    if (found) {
        await DBMinTicTestController.deleteBusinessInAskResultStadistic(idBusiness)
        await insert(data)
    } else {
        await insert(data)
    }
    
    // Hacer push

    DBMinTicTestController.allAskResults = resultByProcess;
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
DBMinTicTestController.deleteBusinessInAskResultStadistic = async function(idBusiness) {
    const found = await DBMinTicTestController.validateBusinessInAsks(idBusiness);
    
    if (found) {
        await connection.query(
            ` DELETE FROM MINTIC_MODEL.ask_result_stadistic WHERE id_business=${idBusiness};  `
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
DBMinTicTestController.validateBusinessInAskResultStadistic = async function (idBusiness) {
    const response = await DBMinTicTestController.pullAllAskResultStadistic();
    let idBusinessFound = false;
    for ( let property of response ){
        if (idBusiness === property.id_business) {
            idBusinessFound = true;
            return idBusinessFound
        }
    }
    return idBusinessFound
}

// Refactor data
DBMinTicTestController.tagProcessSelected = function (asks) {
    let j = 0; let askByProcess = {}; let = []; let object = ""; let value = []; let idQuestion = [];
    let process = [];

    for (let i = 0; i < ProcessSelected.allProcessSelected.processId.length ; i++ ){
        let tagProcess = DBMinTicTestController.eliminarDiacriticos(ProcessSelected.allProcessSelected.process[i])
        process[ProcessSelected.allProcessSelected.processId[i]] = {
            tagProcess: DBMinTicTestController.createElements(tagProcess),
            processName: ProcessSelected.allProcessSelected.process[i]
        }
    }

    /*
        askByProcess: {
            process_1: {
                id: number,
                processName: string,
                value: number[],
                idQuestion: number[]
            }
            ..
            ..
            ..
            process_n: {
                id: number,
                processName: string,
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
DBMinTicTestController.resultByProcess = function (askByProcess, idBusiness) {
    let resultByProcess = {};

    resultByProcess["idSector"] = ProcessSelected.allProcessSelected.idSector;
    resultByProcess["sector"] = ProcessSelected.allProcessSelected.sector;
    resultByProcess["idBusiness"] = idBusiness;

    for(property in askByProcess){
        let [summ, average] = AritmeticFunctions.prom(askByProcess[property].value);
        let varianze = AritmeticFunctions.varianze(average, askByProcess[property].value);
        resultByProcess[property] = {
            processName: askByProcess[property].processName,
            processId: askByProcess[property].id,
            total: summ,
            average: average,
            cantN: askByProcess[property].value.length,
            varianze: varianze,
            standardDeviation: Math.pow(varianze, 1/2).toFixed(3)
        }
    }
    return resultByProcess
}


module.exports = DBMinTicTestController;