const arrayAvg = (myArray) => {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    let prom  = summ/ArrayLen;
    prom = parseFloat(prom.toFixed(3))
    return prom;
}

const isObjEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

const sectorList = async () => {
    const response = await fetch('api/v1');
    let result = await response.json();
    const sector = result.sectorMinTic; let i = 0;
    let sectors = {
        idSector: [],
        sector: []
    }
    for (let property of sector) {
        sectors.idSector[i] = property.id_tipo_empresa;
        sectors.sector[i] = property.tipo_empresas;
        i = i + 1;
    }
    return sectors
}

const stadisticData = async (idSector) => {
    const response = await fetch(`api/v1/DBMinTicTestResult/${idSector}`);
    let result = await response.json();
    return result.DBMinTicTestResultController;
}

const refactorData = async (sectorsList) => {
    let result = []; let i = 0; let sector = {sectorId:[], sector:[]};

    for (element of sectorsList.idSector) {
        const minTicResult = await stadisticData(element);
        let data = {}; 

        if (!isObjEmpty(minTicResult)) {
            for (property in minTicResult) {
                if (property !== "sector" && property !== "sectorId") {
                    data[property] = {
                        idProcess: minTicResult[property].idProcess,
                        process: minTicResult[property].process,
                        average: arrayAvg(minTicResult[property].average),
                        total: arrayAvg(minTicResult[property].total)
                    }
                }
                data["sectorId"] = minTicResult["sectorId"];
                data["sector"] = minTicResult["sector"];
            }
            sector.sectorId.push(minTicResult["sectorId"])
            sector.sector.push(minTicResult["sector"])
            result[i] = data;
            i = i + 1;
        }
    }
    return [result, sector]
}

const drawAxisTickColors = async (resultData, idDivGraph, sector) => {
    let data = google.visualization.arrayToDataTable(resultData);

    var options = {
        title: 'Resultados MinTic',
        chartArea: { width: '50%' },
        hAxis: {
            title: 'Valor',
            minValue: 0,
            textStyle: {
                bold: true,
                fontSize: 12,
                color: '#4d4d4d'
            },
            titleTextStyle: {
                bold: true,
                fontSize: 18,
                color: '#4d4d4d'
            }
        },
        vAxis: {
            title: `Sector ${sector}`,
            textStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
            },
            titleTextStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
            }
        }
    };
    var chart = new google.visualization.BarChart(document.getElementById(`${idDivGraph}`));
    chart.draw(data, options);
}


const writeGraphic = async (idDivStadisticBody, idDivGraph, stadisticData, sector) => {

    const idDivGraph_1 = document.createElement('div'); let i = 1; let process = [];
    idDivGraph_1.setAttribute("id", `${idDivGraph}`)
    idDivGraph_1.setAttribute("style", "height: 60vh; width:100%;")
    idDivStadisticBody.appendChild(idDivGraph_1)

    process[0] = ['Process', 'Total', 'Promedio'];
    for (property in stadisticData) {
        if (property !== "sectorId" && property !== "sector" && property !== undefined) {
            process[i] = [stadisticData[property].process, stadisticData[property].total, stadisticData[property].average];
            i = i + 1;
        }
    }

    await google.charts.load('current', { packages: ['corechart', 'bar'] });
    await google.charts.setOnLoadCallback( drawAxisTickColors(process, idDivGraph, sector));
}

const main = async () => {
    const sectorsList = await sectorList();
    console.log(sectorsList)
    const [result, sector] = await refactorData(sectorsList)    
    const stadisticBody = document.getElementById("stadisticBody");
    
    for (let i =0; i<sector.sectorId.length; i++) {
        writeGraphic(stadisticBody, `chart_div_${i}`, result[i], sector.sector[i])
    }
    
}

main()

