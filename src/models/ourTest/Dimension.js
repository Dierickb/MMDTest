const connection = require('../../accessDB')

let Dimension = function (idDimensions, dimensions) {
    this.idDimensions = idDimensions;
    this.dimensions = dimensions;
}

Dimension.clear = function() {
    Dimension.allDimension.dimensions.length = 0;
    Dimension.allDimension.idDimensions.length = 0;
}

Dimension.allDimension = {
    idDimensions: [],
    dimensions: [],
}

Dimension.add = async function (dimension) {
    Dimension.clear();
    let i = 0;
    let dimensionData = {
        idDimensions: [],
        dimensions: [],
    }
    for (let element of dimension) {
        dimensionData.idDimensions[i] = element.iddimension;
        dimensionData.dimensions[i] = element.dimension;
        i = i +1;
    }

    Dimension.allDimension.idDimensions = dimensionData.idDimensions;
    Dimension.allDimension.dimensions = dimensionData.dimensions;

    return Dimension.allDimension
}

Dimension.pullDB = async function () {
    const response = await connection
        .query(
            `   
                SELECT * FROM pf.dimension
                
            `
        )
        .catch((e) => {
            throw e;
        });
        
    return await Dimension.add(response)
}

module.exports = Dimension;