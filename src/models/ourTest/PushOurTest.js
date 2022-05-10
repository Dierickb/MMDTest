const connection = require('../../accessDB');

let PushOurTest = function ( bussisness, idSector, idDimension, idQuestion, valueQuestion ) {
    this.bussisness = bussisness;
    this.idSector = idSector;
    this.idDimension = idDimension;
    this.idQuestion = idQuestion;
    this.valueQuestion = valueQuestion;
}

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

PushOurTest.pushBusiness = async function (busisnessName, idSector) {    
    idSector = parseInt(idSector);
    const [finded, id] = await PushOurTest.validateBusiness(busisnessName, idSector)
  
    if (!finded) {
        await connection.query(
            `   
                INSERT INTO pf.businesses (businesses, id_sector)
                VALUES ("${busisnessName}", ${idSector});
            `
        )
        .catch((e) => {
            throw e;
        });
    } else {
        return id;
    }
}

PushOurTest.pushAskResult = async function (idbusiness ,askObject) {
    const value = askObject.value;
    const questionId = askObject.idQuestion;
    let data = '';
    for (let i =0; i< value.length -2; i++) {
        data = data.concat(`("${idbusiness}", "${value[i]}", "${questionId[i]}" ), `);
    }

    data = data.concat(`("${idbusiness}", "${value[value.length -1]}", "${questionId[value.length -1]}" ); `) ;

    console.log(data)
    await connection.query(
        `   
            INSERT INTO pf.asksresults (idbusisnesses, idquestion, value)
            VALUES
                ${data}
        `
    )
    .catch((e) => {
        throw e;
    });
}

PushOurTest.deleteBusinessById = async function(id) {
    PushOurTest.validateBusinessById(id)

    await connection.query(
        ` DELETE FROM pf.businesses WHERE idbusinesses=${id};  `
    )
    .catch((e) => {
        throw e;
    });

}
 
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
    return (finded)
}

module.exports = PushOurTest;