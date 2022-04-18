var OurFormulario = function (idDimensions, idButtonsDim, dimensions, questions) {
    this.dimensions = dimensions;
    this.idButtonsDim = idButtonsDim;
    this.questions = questions;
    this.idDimensions = idDimensions;
}

OurFormulario.prototype.toString = function () {
    return 'columnHeader: ' + this.columnHeader + " | dimensions: " + this.dimensions;
};
//hola
OurFormulario.allForm = [];

OurFormulario.add = function (aForm) {
    OurFormulario.allForm.push(aForm);
};

OurFormulario.finById = function (aFormId) {
    var aForm = OurFormulario.allForm.find(x => x.idDimensions == aFormId);
    if (aForm)
        return aForm
    else
        throw new Error(`No existe una bicicleta con el id ${aFormId}`);
};

OurFormulario.removeById = function (aBiciId) {
    for (let i = 0; i < OurFormulario.allForm.length; i++) {
        if (OurFormulario.allForm[i].id == aFormId) {
            OurFormulario.allForm.splice(i, 1);
            break;
        };
    };
};

var a = new OurFormulario('persAndCultDimens', 'pc', 'Personal y Cultura', ["Dierick1 asdadasd",
    "DBNiebles",
    "sdadadadad",
    "adasdadadfsafa",
    "asdasdasdas"]);
var b = new OurFormulario('estrategiaDimens', 'estr', 'Estrategia', ["Dierick2 asdadasd",
"DBNiebles",
"sdadadadad",
"adasdadadfsafa",
"asdasdasdas"]);
var c = new OurFormulario('orgAndEstraDimens', 'orgStr', 'Organización y Estructura', ["Dierick3 asdadasd",
"DBNiebles",
"sdadadadad",
"adasdadadfsafa",
"asdasdasdas"]);
var d = new OurFormulario('processDimens', 'prcs', 'Procesos', ["Dierick4 asdadasd",
"DBNiebles",
"sdadadadad",
"adasdadadfsafa",
"asdasdasdas", "Dierick"]);

OurFormulario.add(a);
OurFormulario.add(b);
OurFormulario.add(c);
OurFormulario.add(d);

module.exports = OurFormulario;