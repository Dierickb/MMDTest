const connection = require('../accessDB')

let Sectors = function ( idSector, sector ) {
    this.sector = sector;
    this.idSector = idSector;
}

Sectors.prototype.toString = function () {
    return 'sector: ' + this.sector + ' | id_sector: ' + this.idSector;
}

Sectors.allSectors = []

Sectors.add = function (allSectors) {
    Sectors.allSectors.push(allSectors);
}

Sectors.finById = function (aSectorsId) {
    var aSectors = Sectors.aSectors.find(x => x.idSector == aSectorsId);
    if (aSectors)
        return aSectors
    else
        throw new Error(`No existe un sector economico con el id ${aSectorsId}`);
};

Sectors.removeById = function (aSectorId) {
    for (let i = 0; i < Sectors.allSectors.length; i++) {
        if (Sectors.allSectors[i].id == aSectorId) {
            Sectors.allSectors.splice(i, 1);
            break;
        };
    };
};

Sectors.pullDB = function() {
    connection.query(
        `SELECT * FROM MINTIC_MODEL.tipo_empresa`,
        (err, results, fields) => {
            if (err) throw err;
            for (let value of results ){
                Sectors.add(value)
            }
        }
    )
}

module.exports = Sectors;