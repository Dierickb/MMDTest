const apiResultOurTest = async () => {
    const dierick = await $.ajax({
        dataType: "json",
        url: ("api/v1/ourTestResult"),
        success: function (result) {
            return result.askByDimension;
        }
    });
    const resultData = dierick.askByDimension;
    let dimension = []; let i = 1;
    dimension[0] = ['Dimension', 'Total', 'Promedio'];
    for (property in resultData) {
        console.log(property)
        if (property !== "idSector" && property !== "sector" && property !== undefined) {
            dimension[i] = [resultData[property].dimension, resultData[property].total, resultData[property].average];
            i = i + 1;
        }
    }
    return dimension
};

const drawAxisTickColorsOurTest = async () => {
    const resultData = await apiResultOurTest()
    let data = google.visualization.arrayToDataTable(resultData);

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

google.charts.load('current', { packages: ['corechart', 'bar'] });
google.charts.setOnLoadCallback( drawAxisTickColorsOurTest);