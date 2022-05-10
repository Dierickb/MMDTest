let dierick = [];
let cantQuestionsTotal = 0;
let totalCantCheckBox = 0;

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
        timer: 1500,
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

const apiForm = (myUrl) => {
    $.ajax({
        dataType: "json",
        url: ("api/v1/" + myUrl),
        success: function (result) {
            let form = Object.values(result)[0];  //Convierto el objeto en un array 
            console.log(form)
            cnatDierick = 0;
            for (let property in form) {
                if(property !== "dimensionId" && property !== "dimension" && property !== "formularyId") {
                    console.log(property.length)
                }
            }
            for (let i = 0; i < form.length ; i++) {
                dierick[i] = form[i].questions.length
                cantQuestionsTotal += dierick[i];
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


const redirect = (nextUrl, data) => {
    postDatos(nextUrl, data);   
    if (nextUrl === "OurTest") {
        window.location.href = "/MinTicTest";
    }
};

const resIsConfirmed = (results, task) => {
    if (results.dismiss === Swal.DismissReason.cancel) { 
        swalWithBootstrapButtons.fire(
            'Envio cancelado',
            'El formulario no ha sido enviado',
            'error'
        )
    }
};

const validateCardsContent = () => {
    const URLactual = window.location.href;
    const formulario = document.getElementById("firstForm");
    let url = URLactual.split('/')[3];

    apiForm(url);

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        let tasks = e.target.elements;
        let task = totalCantCheckBoxFunc(tasks, totalCantCheckBox);
        //console.log(task)
        if (task.length < cantQuestionsTotal) {
            oppsAdvice();           
        } else {
            resIsConfirmed(result, url, task);
        }
    });
};

validateCardsContent();