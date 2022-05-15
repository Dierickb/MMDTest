function eliminarDiacriticos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function createElementProcess(process) {
    return process.replace(/ /g, "_")
}