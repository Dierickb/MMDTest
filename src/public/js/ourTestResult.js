let dimensions_1; let dimensionId_1 = {dimension: [], dimensionId:[], level:[]};

const levelFunc = (data) => {
    if (data<2) {
        return 1
    }
    if (data<3) {
        return 2
    }
    if (data<4) {
        return 3
    }
    if (data<5) {
        return 4
    }
    if (data === 5) {
        return 5
    }

}

const resultByDimension = async () => {
    let response = await fetch('api/v1/ourTestResult');
    response = await response.json();
    let dimensionId = [];
    const resultData = response.askByDimension;
    let dimension = []; let i = 1; let dimensions = []; let level = [];
    dimension[0] = ['Dimension', 'Total', 'Promedio'];

    for (property in resultData) {
        if (property !== "idSector" && property !== "sector" && property !== undefined && property !== "idBusiness") {
            dimension[i] = [resultData[property].dimension, resultData[property].total, resultData[property].average];
            
            dimensionId[i-1] = resultData[property].dimensionId;
            dimensions[i-1] = resultData[property].dimension;
            level[i-1] = levelFunc(resultData[property].average)
            i = i + 1;
        }
    }

    dimensions_1 = dimension;
    dimensionId_1.dimensionId = dimensionId;
    dimensionId_1.dimension = dimensions;
    dimensionId_1.level = level;
}

const levelByDimension = async (dimension, level) => {
    let response = await fetch(`api/v1/ourTestResult/${dimension}/${level}`);
    response = await response.json(); let result = {dimension:"", level:0, question:[] }
    response = response.levelByDimension
    for (let element of response) {
        result.dimension = element.dimension;
        result.level = element.nivel;
        result.question.push(element.question)
    }
    return result;
}

const drawAxisTickColorsOurTest = async () => {
    let data = google.visualization.arrayToDataTable(dimensions_1);

    var options = {
        title: 'Resultado del test',
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
            title: 'Dimensión',
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
    var chart = new google.visualization.BarChart(document.getElementById('chart_div_ourTest'));
    chart.draw(data, options);
}

const main = async () => {
    await resultByDimension();
    const criteriosDimension = document.getElementById("criteriosDimension");

    for (let i = 0; i<dimensionId_1.dimensionId.length; i++) {
        const response = await levelByDimension(dimensionId_1.dimensionId[i], dimensionId_1.level[i])
        
        const divDimension = document.createElement("div");
        divDimension.setAttribute("class", "dimensionResult");
        const divTitle = document.createElement("div");
        divTitle.setAttribute("class", "titleDimension");  
        const dimensionTitle = document.createTextNode(`${response.dimension} se encuentra en el nivel ${response.level}`);
        const divContainer = document.createElement('div') ;
        const ol = document.createElement("ul");
        
        criteriosDimension.appendChild(divDimension)
        divDimension.appendChild(divTitle)
        divTitle.appendChild(dimensionTitle)

        divDimension.appendChild(divContainer)
        divContainer.appendChild(ol);

        for (let element of response.question){
            const li = document.createElement("li")        
            const textQuestion = document.createTextNode(element);

            ol.appendChild(li);
            li.appendChild(textQuestion);
        }
        

        console.log(response)
    }

    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawAxisTickColorsOurTest);
    
    $(window).resize(function () {
        drawAxisTickColorsOurTest();
    });
}

main()

