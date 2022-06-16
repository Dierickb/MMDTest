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

Sectors.pullDB = function() {
    connection.query(
        `SELECT * FROM MINTIC_MODEL.economic_sector`,
        (err, results, fields) => {
            if (err) throw err;
            for (let value of results ){
                Sectors.add(value)
            }
        }
    )
}

module.exports = Sectors;