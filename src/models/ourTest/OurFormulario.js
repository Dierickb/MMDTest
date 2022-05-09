const connection = require('../../accessDB')

let OurFormulary = function (idDimensions, dimensions, idButtonsDim, questions, prcsHabl) {
    this.idDimensions = idDimensions;
    this.dimensions = dimensions;
    this.idButtonsDim = idButtonsDim;
    this.questions = questions;
    this.prcsHabl = prcsHabl;
}

OurFormulary.pullDB = async function (idFilterBySector) {
    const response = await connection
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
        });
    return response
}

module.exports = OurFormulary;