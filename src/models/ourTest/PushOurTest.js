const connection = require('../../accessDB');

let PushOurTest = function ( bussisness, idSector, idDimension, idQuestion, valueQuestion ) {
    this.bussisness = bussisness;
    this.idSector = idSector;
    this.idDimension = idDimension;
    this.idQuestion = idQuestion;
    this.valueQuestion = valueQuestion;
}


// Pull data
PushOurTest.allBussisness = async function () {
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
PushOurTest.allBussisnessInAsks = async function () {
    const response = await connection.query(
        `   
            SELECT idbusisnesses FROM pf.asksresults
            GROUP BY idbusisnesses
        `
    )
    .catch((e) => {
        throw e;
    });
    return response
}

// Push
PushOurTest.pushBusiness = async function (busisnessName, idSector) {    
    idSector = parseInt(idSector);
    const [finded, id] = await PushOurTest.validateBusiness(busisnessName, idSector)
    let response
    
    if (!finded) {
        response = await connection.query(
            `   
                INSERT INTO pf.businesses (businesses, id_sector)
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
PushOurTest.pushAskResult = async function (idbusiness, askObject) {
    const finded = await PushOurTest.validateBusinessInAsks(idbusiness)
    const value = askObject.value; const questionId = askObject.idQuestion; let data = '';
    const insert = async (asks) => {
        connection.query(
            `INSERT INTO pf.asksresults (idbusisnesses, value, idquestion) VALUES ${asks}`
        )
        .catch((e) => {
            throw e;
        });
    }
    for (let i =0; i< value.length -1; i++) {
        data = data.concat(`("${idbusiness}", "${value[i]}", "${questionId[i]}" ), `);
    }    
    data = data.concat(`("${idbusiness}", "${value[value.length -1]}", "${questionId[value.length -1]}" ); `) ;

    if (finded) {
        await PushOurTest.deleteBusinessInAskByBusiness(idbusiness)
        await insert(data)
    } else {
        await insert(data)
    }    
}

// Delete
PushOurTest.deleteBusinessById = async function(id) {
    PushOurTest.validateBusinessById(id)

    await connection.query(
        ` DELETE FROM pf.asksresults WHERE idbusinesses=${id};  `
    )
    .catch((e) => {
        throw e;
    });

}
PushOurTest.deleteBusinessInAskByBusiness = async function(idBusiness) {

    const finded = await PushOurTest.validateBusinessInAsks(idBusiness);
    
    if (finded) {
        await connection.query(
            ` DELETE FROM pf.asksresults WHERE idbusisnesses=${idBusiness};  `
        )
        .catch((e) => {
            throw e;
        });
    } else {
        throw new Error("This business id does not exist")
    }
}


// Validations

PushOurTest.validateBusinessById = async function (id) {
    const businessDB = await PushOurTest.allBussisness()
    const finded = false;

    for ( element of businessDB ) {
        if ( element.idbusinesses === id) {
            finded = true ;
        }
    }
    return finded
}
PushOurTest.validateBusiness = async function (business, idSector) {
    const businessDB = await PushOurTest.allBussisness()
    let finded = false; let id = 0;
    for ( element of businessDB ) {
        if ( element.businesses === business && element.id_sector === idSector) {
            finded = true;
            id = element.idbusinesses
            return [finded, id]
        }
    }
    id = null;
    return [finded, id]
}
PushOurTest.validateBusinessInAsks = async function (idBusiness) {
    const response = await PushOurTest.allBussisnessInAsks();
    let idBusinessFound = false;
    for ( let property of response ){
        if (idBusiness === property.idbusisnesses) {
            idBusinessFound = true;
            return idBusinessFound
        }
    }
    return idBusinessFound
    
}

module.exports = PushOurTest;