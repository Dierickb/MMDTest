let ProcessSelected = function (idProcess, process, idSector) {
    this.idProcess = idProcess;
    this.process = process;
    this.idSector = idSector;
}

ProcessSelected.prototype.toString = function () {
    return 'sector: ' + this.sector + ' | id_sector: ' + this.idSector;
}

ProcessSelected.toNumber = function (id) {
    return parseInt(id);
}

ProcessSelected.allProcessSelected = {
    idSector: 0,
    sector: '',
    processId: [],
    process: [],
    length: 0
}

ProcessSelected.clean = async function() {
    ProcessSelected.allProcessSelected.length = 0;
}

ProcessSelected.add = async function (processSelected) {
    ProcessSelected.allProcessSelected.sector = processSelected.sector;
    ProcessSelected.allProcessSelected.idSector = processSelected.idSector;
    ProcessSelected.allProcessSelected.processId = processSelected.processId;
    ProcessSelected.allProcessSelected.process = processSelected.process;
    ProcessSelected.allProcessSelected.length = processSelected.length;
}

module.exports = ProcessSelected;