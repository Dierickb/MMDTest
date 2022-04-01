const questions = {
    PersonalAndCulture: ["Dierick1 asdadasd",
        "DBNiebles",
        "sdadadadad",
        "adasdadadfsafa",
        "adsadasadadad",
        "adadadadasdfasfas",
        "adadadadadadsa",
        "asdadasdasa",
        "asdasdasdas"],
    Estrategy: ["Dierick2 asdadasd",
        "DBNiebles",
        "sdadadadad",
        "adasdadadfsafa",
        "adsadasadadad",
        "adadadadasdfasfas",
        "adadadadadadsa",
        "asdadasdasa",
        "asdasdasdas"],
    OrganizationAndStructure: ["Dierick3 asdadasd",
        "DBNiebles",
        "sdadadadad",
        "adasdadadfsafa",
        "adsadasadadad",
        "adadadadasdfasfas",
        "adadadadadadsa",
        "asdadasdasa",
        "asdasdasdas"],
    Process: ["Dierick4 asdadasd",
        "DBNiebles",
        "sdadadadad",
        "adasdadadfsafa",
        "adsadasadadad",
        "adadadadasdfasfas",
        "adadadadadadsa",
        "asdadasdasa",
        "asdasdasdas", "Dierick"],
};

const dimensions = {
    PersonalAndCulture: ["persAndCultDimens", "Personal y Cultura", "pc", questions.PersonalAndCulture],
    Estrategy: ["estrategiaDimens", "Estrategia", "estr", questions.Estrategy],
    OrganizationAndStructure: ["orgAndEstraDimens", "Organización y Estructura", "orgStr", questions.OrganizationAndStructure],
    Process: ["processDimens", "Procesos", "prcs", questions.Process],
};

const columnHeader = ["#", "Preguntas", "1", "2", "3", "4", "5"];

let dierick = [];
let cantQuestionsTotal = 0;
let totalCantCheckBox = 0;

const validateCardsContent = ([data, cantHeader]) => {
    const formulario = document.getElementById("firstForm");
    let form

    $.ajax({
        dataType: "json",
        url: "api/v1/formulario",
        success: function (result) {
            form = result.formulario;
            for (let i = 0; i < form.length; i++) {
                dierick[i] = form[i].questions.length
                cantQuestionsTotal += dierick[i];
            };
            totalCantCheckBox = cantQuestionsTotal * 5;
        }
    });

    formulario.addEventListener('submit', (e) => {
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
                timer: 1500
                //footer: '<a href="">Why do I have this issue?</a>'
            })
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500
            })
        };
    });
    
};

validateCardsContent([dimensions, columnHeader]);