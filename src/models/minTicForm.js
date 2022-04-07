var MinTicForm = function (idDimensions, idButtonsDim, dimensions, questions) {
    this.dimensions = dimensions;
    this.idButtonsDim = idButtonsDim;
    this.questions = questions;
    this.idDimensions = idDimensions;
}

MinTicForm.prototype.toString = function () {
    return 'columnHeader: ' + this.columnHeader + " | dimensions: " + this.dimensions;
};

MinTicForm.allForm = [];

MinTicForm.add = function (aForm) {
    MinTicForm.allForm.push(aForm);
};

MinTicForm.finById = function (aFormId) {
    var aForm = MinTicForm.allForm.find(x => x.idDimensions == aFormId);
    if (aForm)
        return aForm
    else
        throw new Error(`No existe una bicicleta con el id ${aFormId}`);
};

MinTicForm.removeById = function (aBiciId) {
    for (let i = 0; i < MinTicForm.allForm.length; i++) {
        if (MinTicForm.allForm[i].id == aFormId) {
            MinTicForm.allForm.splice(i, 1);
            break;
        };
    };
};

var a = new MinTicForm('persAndCultDimens', 'pc', 'Personal y Cultura', ["Dierick1 asdadasd",
    "DBNiebles",
    "sdadadadad",
    "adasdadadfsafa",
    "adsadasadadad",
    "adadadadasdfasfas",
    "adadadadadadsa",
    "asdadasdasa",
    "asdasdasdas"]);
var b = new MinTicForm('estrategiaDimens', 'estr', 'Estrategia', ["Dierick2 asdadasd",
    "DBNiebles",
    "sdadadadad",
    "adasdadadfsafa",
    "adsadasadadad",
    "adadadadasdfasfas",
    "adadadadadadsa",
    "asdadasdasa",
    "asdasdasdas"]);
var c = new MinTicForm('orgAndEstraDimens', 'orgStr', 'Organización y Estructura', ["Dierick3 asdadasd",
    "DBNiebles",
    "sdadadadad",
    "adasdadadfsafa",
    "adsadasadadad",
    "adadadadasdfasfas",
    "adadadadadadsa",
    "asdadasdasa",
    "asdasdasdas"]);
var d = new MinTicForm('processDimens', 'prcs', 'Procesos', ["Dierick4 asdadasd",
    "DBNiebles",
    "sdadadadad",
    "adasdadadfsafa",
    "adsadasadadad",
    "adadadadasdfasfas",
    "adadadadadadsa",
    "asdadasdasa",
    "asdasdasdas", "Dierick"]);

MinTicForm.add(a);
MinTicForm.add(b);
MinTicForm.add(c);
MinTicForm.add(d);

module.exports = MinTicForm;