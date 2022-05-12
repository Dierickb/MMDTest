const connection = require('../../accessDB');

let DBMinTicTest = function ( bussisness, idSector, idDimension, idQuestion, valueQuestion ) {
    this.bussisness = bussisness;
    this.idSector = idSector;
    this.idQuestion = idQuestion;
    this.valueQuestion = valueQuestion;
}


// Pull data
DBMinTicTest.allBussisness = async function () {
    const response = await connection.query(
        `   
            SELECT * FROM MINTIC_MODEL.business_name
        `
    )
    .catch((e) => {
        throw e;
    });
    return response
}
DBMinTicTest.allBussisnessInAsks = async function () {
    const response = await connection.query(
        `   
            SELECT id_business_name FROM MINTIC_MODEL.ask_results
            GROUP BY id_business_name
        `
    )
    .catch((e) => {
        throw e;
    });
    return response
}

// Push
DBMinTicTest.pushBusiness = async function (busisnessName, idSector) {    
    idSector = parseInt(idSector);
    const [finded, id] = await DBMinTicTest.validateBusiness(busisnessName, idSector)
    
    if (!finded) {
        const response = await connection.query(
            `   
                INSERT INTO MINTIC_MODEL.business_name (business_name, tipo_empresa)
                VALUES ("${busisnessName}", ${idSector});
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
DBMinTicTest.pushAskResult = async function (idbusiness, askObject) {
    const finded = await DBMinTicTest.validateBusinessInAsks(idbusiness)
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
        data = data.concat(`("${idbusiness}", "${questionId[i]}", "${value[i]}"), `);
    }    
    data = data.concat(`("${idbusiness}", "${questionId[value.length -1]}" , "${value[value.length -1]}");`) ;
    if (finded) {
        await DBMinTicTest.deleteBusinessInAskByBusiness(idbusiness)
        await insert(data)
    } else {
        await insert(data)
    }    
}

// Delete
DBMinTicTest.deleteBusinessById = async function(id) {
    const finded = DBMinTicTest.validateBusinessById(id)

    if (finded) {
        await connection.query(
            ` DELETE FROM MINTIC_MODEL.ask_results WHERE id_business_name=${id};  `
        )
        .catch((e) => {
            throw e;
        });
    }

}
DBMinTicTest.deleteBusinessInAskByBusiness = async function(idBusiness) {

    const finded = await DBMinTicTest.validateBusinessInAsks(idBusiness);
    
    if (finded) {
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
DBMinTicTest.validateBusinessById = async function (id) {
    const businessDB = await DBMinTicTest.allBussisness()
    const finded = false;

    for ( element of businessDB ) {
        if ( element.id_business_name === id) {
            finded = true ;
        }
    }
    return finded
}
DBMinTicTest.validateBusiness = async function (business, idSector) {
    const businessDB = await DBMinTicTest.allBussisness()
    let finded = false; let id = 0;
    if (businessDB.length !== 0) {
        for ( element of businessDB ) {
            if ( element.business_name === business && element.tipo_empresa === idSector) {
                finded = true;
                id = element.id_business_name;
                return [finded, id]
            }
        }
    }
    
    id = null;
    return [finded, id]
    
}
DBMinTicTest.validateBusinessInAsks = async function (idBusiness) {
    const response = await DBMinTicTest.allBussisnessInAsks();
    let idBusinessFound = false;
    for ( let property of response ){
        if (idBusiness === property.id_business_name) {
            idBusinessFound = true;
            return idBusinessFound
        }
    }
    return idBusinessFound
    
}

module.exports = DBMinTicTest;