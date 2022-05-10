const connection = require('../../accessDB')

let AxesDimension = function (idDimension, dimension, level, question) {
    this.idDimension = idDimension;
    this.dimension = dimension;
    this.level = level;
    this.question = question;
}

function eliminarDiacriticos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

AxesDimension.createElementsProcess = function (process) {
    return process.replace(/ /g, "_")
}

AxesDimension.toNumber = function (id) {
    return parseInt(id);
}

AxesDimension.allAxesByDimension = {}
AxesDimension.allDimension = [];

AxesDimension.tagDimension = function (data1) {
    let object = ""; let idDimension = [];
    let tagDimension = []; let j = 0;
    let dimensions = [];
    data1.map(element => {
        if (element.dimension !== " ") {
            if (element.dimension !== object) {
                dimensions[j] = element.dimension;
                object = element.dimension;
                idDimension[j] = element.iddimension;
                tagDimension[j] = AxesDimension.createElementsProcess(element.dimension);
                tagDimension[j] = eliminarDiacriticos(tagDimension[j]);
                j = j + 1;
            }
        }
    });
    return [tagDimension, idDimension, dimensions]
}

AxesDimension.arrayToObject = async function (data) {
    let [tagDimension, idDimension, dimensions] = AxesDimension.tagDimension(data)
    let j = 0; let object = "";  let z = 0;
    let k = 0; let n = 0; let m = 0; let i = 0; let b = 0;
    let axesDimension = {
        //dimension: dimensions
    };
    AxesDimension.allDimension.length = 0;
    AxesDimension.allDimension = dimensions
    data.map(element => {

        if (element.dimension !== " ") {
            if (element.dimension !== object) {
                z = 0;
                k = 0; n = 0; m = 0; i = 0; b = 0;
                object = element.dimension;
                axesDimension[tagDimension[j]] = {
                    formularyId: [],
                    dimensionId: idDimension[j],
                    dimension: dimensions[j],
                    level_1: [],
                    level_2: [],
                    level_3: [],
                    level_4: [],
                    level_5: [],
                }
                axesDimension[tagDimension[j]].formularyId[z] = element.idformulary;

                if (element.nivel === 1){
                    axesDimension[tagDimension[j]].level_1[k] = element.question;
                }
                if (element.nivel === 2){
                    axesDimension[tagDimension[j]].level_2[n] = element.question;         
                }
                if (element.nivel === 3){
                    axesDimension[tagDimension[j]].level_3[m] = element.question;
                }
                if (element.nivel === 4){
                    axesDimension[tagDimension[j]].level_4[i] = element.question;
                }
                if (element.nivel === 5){ 
                    axesDimension[tagDimension[j]].level_5[b] = element.question;
                }
                j = j + 1; // j es el contador de los cambios de dimensiones 
            } else if (element.dimension === object) {  
                z = z + 1;
                axesDimension[tagDimension[j-1]].formularyId[z] = element.idformulary;
                if (element.nivel === 1){
                    k = k +1;
                    axesDimension[tagDimension[j-1]].level_1[k] = element.question;
                }
                if (element.nivel === 2){
                    axesDimension[tagDimension[j-1]].level_2[n] = element.question;
                    n=n+1;              
                }
                if (element.nivel === 3){
                    axesDimension[tagDimension[j-1]].level_3[m] = element.question;
                    m=m+1;
                }
                if (element.nivel === 4){
                    axesDimension[tagDimension[j-1]].level_4[i] = element.question;
                    i=i+1;
                }
                if (element.nivel === 5){
                    axesDimension[tagDimension[j-1]].level_5[b] = element.question;
                    b=b+1;
                }          
            }

        }
    });

    return axesDimension
}

AxesDimension.pullDB = async function () {
    AxesDimension.allAxesByDimension = {}
    const response = await connection
        .query(
            `   
                SELECT form.idformulary, dim.dimension, dim.iddimension, form.nivel, form.question
                FROM pf.formulary form
                INNER JOIN pf.dimension dim ON form.iddimension = dim.iddimension
            `
        )
        .catch((e) => {
            throw e;
        });

    AxesDimension.allAxesByDimension = await AxesDimension.arrayToObject(response);
    return AxesDimension.allAxesByDimension 
}

module.exports = AxesDimension;