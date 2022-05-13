const connection = require('../../accessDB');

let OurTestController = function (bussisness, idSector, idDimension, idQuestion, valueQuestion ) {
    this.bussisness = bussisness;
    this.idSector = idSector;
    this.idDimension = idDimension;
    this.idQuestion = idQuestion;
    this.valueQuestion = valueQuestion;
}


// Pull data
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

// Push
OurTestController.pushBusiness = async function (businessName, idSector) {
    idSector = parseInt(idSector);
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
        if (idBusiness === property.idbusisnesses) {
            idBusinessFound = true;
            return idBusinessFound
        }
    }
    return idBusinessFound
    
}

module.exports = OurTestController;