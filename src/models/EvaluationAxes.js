const connection = require('../accessDB')
const ProcessSelected = require('./ProcessSelected');

let AxesByProcess = function (idProcess, process, axes, idSector) {
    this.idProcess = idProcess;
    this.process = process;
    this.idSector = idSector;
    this.axes = axes;
}

AxesByProcess.prototype.toString = function () {
    return 'sector: ' + this.sector + ' | id_sector: ' + this.idSector;
}

AxesByProcess.toNumber = function (id) {
    return parseInt(id);
}

AxesByProcess.createElementsProcess = function (process) {
    return process.replace(/ /g, "_")
}

AxesByProcess.axesByProcess = {
    idSector: 0,
    processId: [],
    process: [],
    axesByProcess: {},
    length: 0
}

AxesByProcess.pullDB = async function (idProcesses) {
    let data = ''
    for (let i = 0; i < idProcesses.length; i++) {
        if (i == 0) {
            data = data.concat(' ', `WHERE ev.id_proceso = "${idProcesses[i]}"`)
        } else {
            data = data.concat(' ', `OR ev.id_proceso = "${idProcesses[i]}"`)
        }
    }
    const response = await connection
        .query(
            `   
                    SELECT ev.id_eje_evaluacion, ejev.nombre_metodo,  ev.id_proceso, p.proceso
                    FROM MINTIC_MODEL.evaluacion ev
                    INNER JOIN MINTIC_MODEL.ejes_evaluacion ejev ON ev.id_eje_evaluacion = ejev.id_eje_evaluacion
                    INNER JOIN MINTIC_MODEL.procesos p ON ev.id_proceso = p.id_proceso
                    ${data}
                `
        )
        .catch((e) => {
            throw e;
        });

    return response
}

AxesByProcess.tagProcess = function (data) {
    let object = "";
    let tagProcess = []; let j = 0;
    data.map(element => {
        if (element.proceso !== object) {
            object = element.proceso;
            tagProcess[j] = AxesByProcess.createElementsProcess(element.proceso); 
            j = j +1;
        }
    });
    console.log(data)
    console.log(tagProcess)
    return tagProcess
}

module.exports = AxesByProcess;