function ArrayAvg(myArray) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
}
    return summ / ArrayLen;
}

let AritmeticFunctions = function (){

}

AritmeticFunctions.prom = function(myArray){
    let i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    let prom = summ / ArrayLen
    prom = prom.toFixed(3)
    return [summ, parseFloat(prom)];
}

AritmeticFunctions.varianze = function(average, myArray){
    let s2 = 1/ (myArray.length - 1); let cache = 0;
    myArray.map(element => {
        cache = cache + Math.pow(element-average, 2)
    })

    s2 = s2 * cache;
    return parseFloat(s2.toFixed(3))
}

module.exports = AritmeticFunctions