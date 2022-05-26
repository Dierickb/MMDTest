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
            
            dimensionId.push(resultData[property].dimensionId)
            dimensions.push(resultData[property].dimension)
            level.push(levelFunc(resultData[property].average))

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

const ourResultChartJs = async (parameters) => {
    let average = []; let labels = [];
    for (let i = 1; i < parameters.length ; i++) {
        average.push(parameters[i][2])
        labels.push(parameters[i][0])
    }

    const data = {
        labels: labels,
        datasets: [{
            label: 'MMDtest',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: average,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    suggestedMin: 1,
                    suggestedMax: 5
                }
            },
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        },
    };

    const myChart = new Chart(
        document.getElementById('chart_div_ourTest'),
        config
    );

    myChart
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
    }

    ourResultChartJs(dimensions_1)
}

main()

