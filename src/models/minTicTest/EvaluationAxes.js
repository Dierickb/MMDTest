const connection = require('../../accessDB')

function eliminarDiacriticos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}

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

AxesByProcess.axesByProcess = {
    idSector: 0,
    sector: "",
    processId: [],
    tagProcess: [],
    axesByProcess: {},
    id_eje_evaluacion: {},
}

AxesByProcess.add = async function (idSector, sector, idProcess, tagProcess, axesByProcess, id_eje_evaluacion) {
    AxesByProcess.axesByProcess.idSector = idSector;
    AxesByProcess.axesByProcess.sector = sector;
    AxesByProcess.axesByProcess.processId = idProcess;
    AxesByProcess.axesByProcess.tagProcess = tagProcess; 
    AxesByProcess.axesByProcess.axesByProcess = axesByProcess;
    AxesByProcess.axesByProcess.id_eje_evaluacion = id_eje_evaluacion;
}

AxesByProcess.createElementsProcess = function (process) {
    return process.replace(/ /g, "_")
}

AxesByProcess.tagProcess = function (data) {
    let object = ""; let idProcess = [];
    let tagProcess = []; let j = 0;
    data.map(element => {
        if (element.proceso !== object) {
            object = element.proceso;
            idProcess[j] = element.id_proceso;
            tagProcess[j] = AxesByProcess.createElementsProcess(element.proceso); 
            j = j +1;
        }
    });

    return [ tagProcess, idProcess ]
}

AxesByProcess.arrayToObject = async function ( processData ) {
    let [ tagProcess,  idProcess ] = AxesByProcess.tagProcess( processData )
    let j = 0;
    let axesByProcess = {};
    let id_eje_evaluacion = {};

    idProcess.map(idArray => {
        let data = []; let i = 0;
        let eje_evaluacion = [];
        processData.map(element => {
            if (element.id_proceso === idArray) {
                data[i] = element.nombre_metodo;
                eje_evaluacion[i] = element.id_evaluacion;
                i = i + 1;
            }            
        })      

        tagProcess[j] = tagProcess[j].toLowerCase(); 
        tagProcess[j] = eliminarDiacriticos(tagProcess[j])
        axesByProcess[tagProcess[j]] = data;
        id_eje_evaluacion[tagProcess[j]] = eje_evaluacion;
        j = j + 1;
    })
    return [idProcess, tagProcess, axesByProcess, id_eje_evaluacion];
}

AxesByProcess.pullDB = async function (idProcesses) {
    let data = ''
    for (let i = 0; i < idProcesses.length; i++) {
        if (i === 0) {
            data = data.concat(' ', `WHERE ev.id_proceso = "${idProcesses[i]}"`)
        } else {
            data = data.concat(' ', `OR ev.id_proceso = "${idProcesses[i]}"`)
        }
    }
    const response = await connection
        .query(
            `   
                    SELECT ev.id_evaluacion, ev.id_eje_evaluacion, ejev.nombre_metodo,  ev.id_proceso, p.proceso
                    FROM MINTIC_MODEL.evaluacion ev
                    INNER JOIN MINTIC_MODEL.ejes_evaluacion ejev ON ev.id_eje_evaluacion = ejev.id_eje_evaluacion
                    INNER JOIN MINTIC_MODEL.procesos p ON ev.id_proceso = p.id_proceso
                    ${data}
                `
        )
        .catch((e) => {
            throw e;
        });

    return AxesByProcess.arrayToObject(response);
}

module.exports = AxesByProcess;