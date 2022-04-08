const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
});
let dierick = [];
let cantQuestionsTotal = 0;
let totalCantCheckBox = 0;

const postDatos = async (url, data) => {
    let json = JSON.stringify(data);
    return await fetch(url, {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json'
        }
    })

};

const ourForm = () => {
    $.ajax({
        dataType: "json",
        url: "api/v1/ourForm",
        success: function (result) {
            let form = result.ourFormulario;
            for (let i = 0; i < form.length; i++) {
                dierick[i] = form[i].questions.length
                cantQuestionsTotal += dierick[i];
            };
            totalCantCheckBox = cantQuestionsTotal * 5;
        }
    });
};

const MinTicForm = () => {
    $.ajax({
        dataType: "json",
        url: "api/v1/minTicForm",
        success: function (result) {
            let form = result.minTicFormulario;
            for (let i = 0; i < form.length; i++) {
                dierick[i] = form[i].questions.length
                cantQuestionsTotal += dierick[i];
            };
            totalCantCheckBox = cantQuestionsTotal * 5;
        }
    });
};

const redirect = async (nextUrl, data) => {
    let result = await postDatos(nextUrl, data);
    if (nextUrl === "/ourForm") {
        
        console.log(result);
        window.location.href = "/MinTicTest";
    };
};

const validateCardsContent = () => {
    const URLactual = window.location.href;
    const formulario = document.getElementById("firstForm");
    let url;

    if (URLactual === "http://localhost/OurTest") {
        url = "/OurTest"
        ourForm();
    };
    if (URLactual === "http://localhost/MinTicTest") {
        url = "/MinTicTest"
        MinTicForm();
    };

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        let tasks = e.target.elements;
        let k = 0;
        let task = []

        for (let j = 0; j < totalCantCheckBox; j++) {
            if (tasks[j].checked == true) {
                task[k] = [tasks[j].value, tasks[j].id];
                k = k + 1;
            };
        };

        if (task.length < cantQuestionsTotal) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Ha ocurrido un error, por favor responder a todas las preguntas del formulario!',
                timer: 1500,
            });
            
        } else {
            let result = await swalWithBootstrapButtons.fire({
                title: 'Está seguro ?',
                text: "Una vez enviado el test, no podrá modificarlo",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,

            })

            if (result.isConfirmed) {
                redirect(url, task);
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Envio cancelado',
                    'El formulario no ha sido enviado',
                    'error'
                )                
            };
        };
    });

};

validateCardsContent();