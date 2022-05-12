let dierick = [];
let cantQuestionsTotal = 0;
let totalCantCheckBox = 0;

const apiFormOurTest = async  (myUrl) => {
    $.ajax({
        dataType: "json",
        url: ("api/v1/" + myUrl),
        success: function (result) {
            let form = Object.values(result)[0];
            for (let property in form) {
                if(property !== "dimensionId" && property !== "dimension" && property !== "formularyId") {
                    cantQuestionsTotal += form[property].formularyId.length;
                }
            }
            totalCantCheckBox = cantQuestionsTotal * 5;
        }
    });
};

const apiFormMinTicTest = async  (myUrl) => {
    $.ajax({
        dataType: "json",
        url: ("api/v1/" + myUrl),
        success: function (result) {
            const process = result.axesByProcess.axesByProcess;
            for (let property in process) {
                cantQuestionsTotal += process[property].length;
            }
            totalCantCheckBox = cantQuestionsTotal * 5;
        }
    });
};

const postDatos = async (url, data) => {
    let json = JSON.stringify(data);
    return await fetch( ('/'+url), {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json'
        }
    })
};

const totalCantCheckBoxFunc = (taskss, totalCantCheckBoxx) => {
    let taskk = [];
    let k = 0;
    for (let j = 0; j < totalCantCheckBoxx; j++) {
        if (taskss[j].checked === true) {
            taskk[k] = [taskss[j].value, taskss[j].id];
            k = k + 1;
        }
    }
    return taskk;
};

const redirect = async (nextUrl, data) => {
    await postDatos(nextUrl, data);
    if (nextUrl === "OurTest") {
        window.location.href = "/PrevTest";
    }
};

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
});


const oppsAdvice = () => {
    Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ha ocurrido un error, por favor responder a todas las preguntas del formulario!',
        timer: 2500,
    });
};

const result = async() => await swalWithBootstrapButtons.fire({
    title: 'Está seguro ?',
    text: "Una vez enviado el test, no podrá modificarlo",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ok',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true,
});

const obtainData = (dataValue)  => {
    const question = {
        value: [],
        idQuestion: [],
    } 
    let i = 0;
    for (element of dataValue) {        
        question.value[i] = parseInt(element[0]);
        question.idQuestion[i] = parseInt(element[1].split("-")[1]);
        i = i + 1;
    }
    return question
}

const resIsConfirmed = (url,results, task) => {  
    if (results.dismiss === Swal.DismissReason.cancel) { 
        swalWithBootstrapButtons.fire(
            'Envio cancelado',
            'El formulario no ha sido enviado',
            'error'
        )
    } 
    if (results.isConfirmed) {
        const data = obtainData(task)
        redirect(url, data)
    }
};

const validateCardsContent = async () => {
    const URLactual = window.location.href;
    const formulario = document.getElementById("firstForm");
    let url = URLactual.split('/')[3];

    if (url === "OurTest"){        
        await apiFormOurTest(url);
    } else {
        await apiFormMinTicTest(url);
    }

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        let tasks = e.target.elements;
        let task = totalCantCheckBoxFunc(tasks, totalCantCheckBox);
        if (task.length === cantQuestionsTotal) {             
            const pullrequest = await result();
            resIsConfirmed(url, pullrequest, task)
        } else {                  
            oppsAdvice();    
        }
    });
};

validateCardsContent();