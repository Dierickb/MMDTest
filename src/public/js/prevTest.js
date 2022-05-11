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


const postDatos = async (data) => {
    let json = JSON.stringify(data);
    return await fetch( ('/PrevTest'), {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json'
        }
    })
};

const checkBoxFunc = (taskss) => {
    let taskk = [];
    let k = 0;
    for (let j = 0; j < taskss.length; j++) {
        if (taskss[j].checked === true) {
            taskk[k] = parseInt(taskss[j].id);
            k = k + 1;
        }
    }
    return taskk;
};


const validateCardsContent = async () => {
    const principalProcess = document.getElementById("principalProcess");

    principalProcess.addEventListener('submit', async (e) => {
        e.preventDefault();

        const task = checkBoxFunc(e.target.elements)

        if (task.length === 0) {
            oppsAdvice()
        } {
            await postDatos(task)
            window.location.href = "/MinTicTest";            
        }
    });
};

validateCardsContent();