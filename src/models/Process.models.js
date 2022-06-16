const connection = require('../accessDB')

let Process = function ( idProcess, process ) {
    this.process = process;
    this.idProcess = idProcess;
}

Process.eliminarDiacriticos = function(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}
Process.createElements = function (process) {
    const data = process.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
    return data.replace(/ /g, "_")
}

Process.allProcess = {
    id: [],
    process: [],
    tagProcess: [],
}

Process.refactorData = function(process) {
    let id = []; let processName = []; let tagProcess = [];
    let i = 0;
    process.map(element => {
        id[i] = element.id_proceso;
        processName[i] = element.proceso;
        tagProcess[i] = Process.createElements(element.proceso);
        i = i +1;
    })
    Process.allProcess.id = id;
    Process.allProcess.process = processName;
    Process.allProcess.tagProcess = tagProcess;
}

Process.pullDB = async function() {
    const data = await connection.query(
        `SELECT * FROM MINTIC_MODEL.process`,
    )
    .catch((e) => {
        throw e;
    })
    Process.refactorData(data)
    return Process.allProcess
}

module.exports = Process;