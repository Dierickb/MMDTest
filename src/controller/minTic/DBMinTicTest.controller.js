const connection = require('../../accessDB');

let DBMinTicTestController = function (businessName, idSector, idDimension, idQuestion, valueQuestion ) {
    this.businessName = businessName;
    this.idSector = idSector;
    this.idQuestion = idQuestion;
    this.valueQuestion = valueQuestion;
}


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

module.exports = DBMinTicTestController;