const connection = require('../../accessDB')

let OurFormulary = function (idDimensions, dimensions) {
    this.idDimensions = idDimensions;
    this.dimensions = dimensions;
}

OurFormulary.pullDB = async function () {
    return await connection
        .query(
            `
                SELECT tep.id_tipo_empresas, te.tipo_empresas, tep.id_proceso, p.proceso
                FROM MINTIC_MODEL.tipo_empresa_proceso tep
                         INNER JOIN MINTIC_MODEL.tipo_empresa te ON tep.id_tipo_empresas = te.id_tipo_empresa
                         INNER JOIN MINTIC_MODEL.procesos p ON tep.id_proceso = p.id_proceso
            `
        )
        .catch((e) => {
            throw e;
        })
}

module.exports = OurFormulary;