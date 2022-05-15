const apiResultMinticTest = async () => {
    const dierick = await $.ajax({
        dataType: "json",
        url: ("api/v1/minTicResult"),
        success: function (result) {
            return result;
        }
    });
    const resultData = dierick.minTicResult;
    let process = []; let i = 1;
    let processProm = [];
    process[0] = ['Process', 'Total', 'Promedio'];
    for (property in resultData) {
        if (property !== "idSector" && property !== "sector" && property !== undefined) {
            process[i] = [resultData[property].processName, resultData[property].total, resultData[property].average];
            i = i + 1;
        }
    }
    return process
};

const drawAxisTickColors = async () => {
    const resultData = await apiResultMinticTest()
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
            title: 'Proceso',
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
    var chart = new google.visualization.BarChart(document.getElementById('chart_div_prom'));
    chart.draw(data, options);
}

google.charts.load('current', { packages: ['corechart', 'bar'] });
google.charts.setOnLoadCallback( drawAxisTickColors);