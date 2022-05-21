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
    process[0] = ['Process', 'Total', 'Promedio'];
    for (property in resultData) {
        if (property !== "idSector" && property !== "sector" && property !== undefined && property !== "idBusiness") {
            process[i] = [resultData[property].processName, resultData[property].total, resultData[property].average];
            i = i + 1;
        }
    }
    return process
};

const minTicResultChartJs = async (parameters) => {
    let average = []; let labels = [];
    for (let i = 1; i < parameters.length; i++) {
        average.push(parameters[i][2])
        labels.push(parameters[i][0])
    }

    const data = {
        labels: labels,
        datasets: [{
            label: 'MinTicTest',
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
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        },
    };

    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    myChart
}

const mainMin = async () => {

    let dimensions_2 = await apiResultMinticTest()

    minTicResultChartJs(dimensions_2)

}

mainMin()

