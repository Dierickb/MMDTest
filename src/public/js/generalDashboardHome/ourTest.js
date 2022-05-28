const stadisticDataOurTest = async (idSector) => {
    const response = await fetch(`api/v1/OurTestResult/${idSector}`);
    let result = await response.json();
    return result.resultBySector;
}
const sectorListOurTest = async () => {
    const response = await fetch('api/v1');
    let result = await response.json();
    const sector = result.secorOurTest; let i = 0;
    let sectors = {
        idSector: [],
        sector: []
    }
    for (let property of sector) {
        sectors.idSector[i] = property.idSector;
        sectors.sector[i] = property.sector;
        i = i + 1;
    }
    return sectors
}
const refactorDataOurTest = async (sectorsList) => {
    let result = []; let i=0; let sector = {sectorId:[], sector:[]}; let j = 0;

    for (let element of sectorsList.idSector) {
        const stadisticData = await stadisticDataOurTest(element)
        let data = {};         
        
        if (!isObjEmpty(stadisticData)) {
            for (property in stadisticData) {
                if (property !== "sector" && property !== "sectorId") {
                    data[property] = {
                        idProcess: stadisticData[property].dimensionId,
                        dimension: stadisticData[property].dimension,
                        average: arrayAvg(stadisticData[property].average),
                        total: arrayAvg(stadisticData[property].total)
                    }
                }
                data["sectorId"] = element;
                data["sector"] = sectorsList.sector[j];
            }
            
            sector.sectorId.push(element)
            sector.sector.push(sectorsList.sector[j])
            result[i] = data;
            i = i + 1;
        }
        j=j+1;
    }
    return [result, sector]
}

const drawAxisTickColorsOurTest = async (resultData, idDivGraph, sector) => {
    let data = google.visualization.arrayToDataTable(resultData);

    var options = {
        title: 'Resultados MMDtest',
        chartArea: { width: '50%' },
        hAxis: {
            title: 'Valor',
            minValue: 0,
            textStyle: {
                bold: true,
                fontSize: 12,
                color: '#4d4d4d'
            }
        },
        vAxis: {
            title: `Sector ${sector}`,
            textStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
            }
        }
    };
    var chart = new google.visualization.BarChart(document.getElementById(`${idDivGraph}`));
    chart.draw(data, options);
}

const writeGraphicOurTest = async (idDivStadisticBody, idDivGraph, stadisticData, sector) => {

    const idDivGraph_1 = document.createElement('div'); let i = 1; let process = [];
    idDivGraph_1.setAttribute("id", `${idDivGraph}`)
    idDivGraph_1.setAttribute("style", "height: 55vh; width:100%;")
    idDivStadisticBody.appendChild(idDivGraph_1)

    process[0] = ['Dimension', 'Promedio'];
    for (property in stadisticData) {
        if (property !== "sectorId" && property !== "sector" && property !== undefined) {
            process[i] = [stadisticData[property].dimension, stadisticData[property].average];
            i = i + 1;
        }
    }

    await google.charts.load('current', { packages: ['corechart', 'bar'] });
    await google.charts.setOnLoadCallback( drawAxisTickColorsOurTest(process, idDivGraph, sector));
}

const mainOurTest = async () => {
    const sectorList = await sectorListOurTest()
    const [result, sector] = await refactorDataOurTest(sectorList)
    const stadisticBody = document.getElementById("ourTestStadistic");

    for (let i =0; i<sector.sectorId.length; i++) {
        writeGraphicOurTest(stadisticBody, `chart_div_ourTest_${i}`, result[i], sector.sector[i])
    }
}
mainOurTest()