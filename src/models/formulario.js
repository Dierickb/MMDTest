var Formulario = function (idDimensions, idButtonsDim, dimensions, questions) {
    this.dimensions = dimensions;
    this.idButtonsDim = idButtonsDim;
    this.questions = questions;
    this.idDimensions = idDimensions;
}

Formulario.prototype.toString = function () {
    return 'columnHeader: ' + this.columnHeader + " | dimensions: " + this.dimensions;
};

Formulario.allForm = [];

Formulario.add = function (aForm) {
    Formulario.allForm.push(aForm);
};

Formulario.finById = function (aFormId) {
    var aForm = Formulario.allForm.find(x => x.idDimensions == aFormId);
    if (aForm)
        return aForm
    else
        throw new Error(`No existe una bicicleta con el id ${aFormId}`);
};

Formulario.removeById = function (aBiciId) {
    for (let i = 0; i < Formulario.allForm.length; i++) {
        if (Formulario.allForm[i].id == aFormId) {
            Formulario.allForm.splice(i, 1);
            break;
        };
    };
};

var a = new Formulario('persAndCultDimens', 'pc', 'Personal y Cultura', ["Dierick1 asdadasd",
    "DBNiebles",
    "sdadadadad",
    "adasdadadfsafa",
    "adsadasadadad",
    "adadadadasdfasfas",
    "adadadadadadsa",
    "asdadasdasa",
    "asdasdasdas"]);
var b = new Formulario('estrategiaDimens', 'estr', 'Estrategia', ["Dierick2 asdadasd",
"DBNiebles",
"sdadadadad",
"adasdadadfsafa",
"adsadasadadad",
"adadadadasdfasfas",
"adadadadadadsa",
"asdadasdasa",
"asdasdasdas"]);
var c = new Formulario('orgAndEstraDimens', 'orgStr', 'Organización y Estructura', ["Dierick3 asdadasd",
"DBNiebles",
"sdadadadad",
"adasdadadfsafa",
"adsadasadadad",
"adadadadasdfasfas",
"adadadadadadsa",
"asdadasdasa",
"asdasdasdas"]);
var d = new Formulario('processDimens', 'prcs', 'Procesos', ["Dierick4 asdadasd",
"DBNiebles",
"sdadadadad",
"adasdadadfsafa",
"adsadasadadad",
"adadadadasdfasfas",
"adadadadadadsa",
"asdadasdasa",
"asdasdasdas", "Dierick"]);

Formulario.add(a);
Formulario.add(b);
Formulario.add(c);
Formulario.add(d);

module.exports = Formulario;