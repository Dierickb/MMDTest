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
    Dierick: ["Dierick5 asdadasd",
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
    PersonalAndCulture: ["persAndCultDimens", "Personal y Cultura", "pc",questions.PersonalAndCulture],
    Estrategy: ["estrategiaDimens", "Estrategia", "estr",questions.Estrategy],
    OrganizationAndStructure: ["orgAndEstraDimens", "orgStr","Organización y Estructura", questions.OrganizationAndStructure],
    Process: ["processDimens", "Procesos", "prcs",questions.Process],
    Dierick: ["Dierick", "Dierick5", "Diericks", questions.Dierick],
};

const columnHeader = ["#", "Preguntas", "1", "2", "3", "4", "5"];

const writeCards = (cardsNumber) => {

    const carouselItem = document.getElementById("carouselItem");
    let active = true;
    var i = 0; //Agrega el numero al final del id y el numero va de 0 hasta la antidad de dimensiones -1 que tenga el objeto

    for (let cards in cardsNumber) {

        let itemsCard = cardsNumber[cards][1];
        const newContent = document.createTextNode(itemsCard);

        const divItem = document.createElement('div');
        const divCardBox = document.createElement('div');
        const divCard = document.createElement('div');
        const divCardTitle = document.createElement('div');
        const divNumbers = document.createElement('div');
        const divCardName = document.createElement('div');
        const divCardContent = document.createElement('div');

        if (active) {
            divItem.setAttribute("class", "carousel-item active");
            active = false;
        } else {
            divItem.setAttribute("class", "carousel-item");
        };

        divCardBox.setAttribute("class", "cardBox  np-b");
        divCard.setAttribute("class", "card nr-b nmg-b {");
        divCardTitle.setAttribute("class", "cardTitle");
        divNumbers.setAttribute("class", "numbers");
        divNumbers.setAttribute("id", "numPos");
        divCardName.setAttribute("class", "cardName");
        divCardContent.setAttribute("class", "cardContent");
        divCardContent.setAttribute("id", "cardContent-" + i);

        carouselItem.appendChild(divItem);
        divItem.appendChild(divCardBox);
        divCardBox.appendChild(divCard);
        divCard.appendChild(divCardTitle);
        divCard.appendChild(divCardContent);
        divCardTitle.appendChild(divNumbers);
        divCardTitle.appendChild(divCardName);
        divNumbers.appendChild(newContent);

        i = i + 1;
    };

    writeIndicators(cardsNumber);
    writeTable(cardsNumber);

};

const writeTable = (tableContent) => {

    let i = 0;

    for (let tC in tableContent) {

        let id = tableContent[tC];

        let cardContent = document.getElementById("cardContent-" + i);
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const trThead = document.createElement('tr');
        const tbody = document.createElement('tbody');

        table.setAttribute("class", "table");

        cardContent.appendChild(table);
        table.appendChild(thead);
        table.appendChild(tbody);
        thead.appendChild(trThead);

        tbody.setAttribute("id", id[0]);
        tbody.setAttribute("class", "dimensionItems");

        i = i + 1;

        for (let j = 0; j < columnHeader.length; j++) {
            const th = document.createElement('th');
            th.setAttribute("scope", "col");
            trThead.appendChild(th);
            let newContent = document.createTextNode(columnHeader[j]);
            th.appendChild(newContent);
        };

    };

    writeTbodyContent(dimensions);

};

const writeTbodyContent = (content) => {

    for (let property in content) {

        let data = content[property][3];

        let estrategiaDimens = document.getElementById(content[property][0]);

        for (let i = 0; i < data.length; i++) { //Crea los tr
            const tr = document.createElement('tr');
            estrategiaDimens.appendChild(tr);
            for (let j = 0; j < columnHeader.length; j++) {// crea los td y su contenido
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
                    input.setAttribute("name", (content[property][2]+"-"+i))
                    input.setAttribute("type", "radio");
                    input.setAttribute("id", content[property][2]+"-"+(i+1)+"-"+(j-1) );

                    label.setAttribute("class", "form-check-label");
                    label.setAttribute("for", "inlineCheckbox" + (j + 1));

                    div.setAttribute("class", "form-check form-check-inline");

                    tr.appendChild(td);
                    td.appendChild(div);
                    div.appendChild(input);
                    div.appendChild(label);
                };

            };

        };

    };
};

const writeIndicators = (indicatorsNumber) => {

    const carouselItem = document.getElementById("carouselIndicators");
    let active = true;

    let i = 1;

    for (let indicators in indicatorsNumber) {

        let itemIndicator = indicatorsNumber[indicators][1];
        console.log(itemIndicator);

        const button = document.createElement('button');
        button.setAttribute("type", "button");
        button.setAttribute("title", itemIndicator);
        button.setAttribute("data-bs-target", "#carouselExampleDark");
        button.setAttribute("data-bs-slide-to", "0");
        button.setAttribute("aria-label", "Slide " + i);

        if (active) {
            button.setAttribute("class", "active");
            button.setAttribute("aria-current", "true");
        };

        carouselIndicators.appendChild(button);
    };

};


writeCards(dimensions);