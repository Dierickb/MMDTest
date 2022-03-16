const input = document.createElement('input');
const label = document.createElement('label');
//const preguntas2 = require('./preguntas.js')

const cargar = () => {
    fetch('preguntas.json')
    .then(respuesta => respuesta.json())
    .then(respuesta => console.log(respuesta))
};

//const jsonData = require('../json/preguntas.json');

const preguntas = {
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
        "asdasdasdas"],
}

let dates = {
    PersonalAndCulture: ["PersAndCultDimens", preguntas.PersonalAndCulture],
    Estrategy: ["estrategiaDimens", preguntas.Estrategy],
    OrganizationAndStructure: ["orgAndEstraDimens", preguntas.OrganizationAndStructure],
    Process: ["processDimens", preguntas.Process],
    
};

const writeTable = (content) => {
    //console.log(jsonData);

    for (let property in content) {
        data = content[property][1];

        let estrategiaDimens = document.getElementById(content[property][0]);

        for (let i = 0; i < data.length; i++) { //Crea los tr
            const tr = document.createElement('tr');
            estrategiaDimens.appendChild(tr);
            for (let j = 0; j < 7; j++) {// crea los td y su contenido
                const td = document.createElement('td');
                const div = document.createElement('div');
                const input = document.createElement("input");
                const label = document.createElement("label");
                td.setAttribute("scope", "col");
                td.setAttribute("class", "wd-min")

                if (j === 0) {
                    let newContent = document.createTextNode(i + 1);
                    tr.appendChild(td);
                    td.appendChild(newContent);
                } else if (j === 1) {
                    let newContent = document.createTextNode(data[i]);
                    tr.appendChild(td);
                    td.appendChild(newContent);
                } else {
                    const newContent = document.createTextNode(j - 1);
                    input.setAttribute("class", "form-check-input");
                    input.setAttribute("type", "checkbox");
                    input.setAttribute("id", "inlineCheckbox" + (j + 1));

                    label.setAttribute("class", "form-check-label");
                    label.setAttribute("for", "inlineCheckbox" + (j + 1));

                    div.setAttribute("class", "form-check form-check-inline");

                    tr.appendChild(td);
                    td.appendChild(div);
                    div.appendChild(input);
                    div.appendChild(label);
                    //label.appendChild(newContent);
                };
                
            };

        };

    }

};

writeTable(dates)