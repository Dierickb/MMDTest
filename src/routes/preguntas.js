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

const validateCardsContent = (data) => {
    const form = document.getElementById("firstForm");
    let levels = columnHeader.length - 2;
    let i = 0;
    let cant = [];
    let totalCant = 0;
    let cantQuestions = [];
    let cantQuestionsTotal = 0;

    for (let property in data) {
        cantQuestions[i] = data[property][3].length;
        cantQuestionsTotal = cantQuestionsTotal + cantQuestions[i];
        cant[i] = cantQuestions[i] * levels;
        totalCant = totalCant + cant[i];
        i = i + 1;
    };

    let cantCards = cantQuestions.length;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let tasks = e.target.elements;
        let k = 0;
        let task = []
        for (let j = 0; j < totalCant; j++) {
            if (tasks[j].checked == true) {
                task[k] = [tasks[j].value, tasks[j].id];
                k = k + 1;
            };
        };

        if (task.length < cantQuestionsTotal) {
            console.log("Debe rellenar tod el formulario");
        } else {
            console.log("Enviado exitosamente");
        };
        console.log(cantQuestionsTotal)

    });
};
module.exports = {
    questions,
    dimensions,
    columnHeader,
};