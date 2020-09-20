//https://pt.wikihow.com/Calcular-a-Varia%C3%A7%C3%A3o-Percentual
export const obterPercentualDesconto = function(desconto, valor) {

    return ((desconto / valor) * 100);
}

export const obterValorDesconto = function(percDesconto, valor) {
    return  (percDesconto * valor) / 100;
}

//https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
// export const formatMoney = (number, decPlaces, decSep, thouSep) => {
//     decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
//     decSep = typeof decSep === "undefined" ? "." : decSep;
//     thouSep = typeof thouSep === "undefined" ? "," : thouSep;
//     var sign = number < 0 ? "-" : "";
//     var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
//     var j = (j = i.length) > 3 ? j % 3 : 0;
    
//     return sign +
//         (j ? i.substr(0, j) + thouSep : "") +
//         i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
//         (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
// }
    
//document.getElementById("b").addEventListener("click", event => {
//document.getElementById("x").innerText = "Result was: " + formatMoney(document.getElementById("d").value);
//});