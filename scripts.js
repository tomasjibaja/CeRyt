const notasList = [
    "negra",
    "doblecorchea",
    "semis",
    "semiCor",
    "corSemi"
]

const notas = {
    negra : "&#9833;",
    doblecorchea : "&#9835;",
    semis : "&#9836;&#9836;",
    semiCor : "&#9836;&#9834;",
    corSemi : "&#9834;&#9836;"
}

function showTempo(valor) {
    document.getElementById("tempo-label").innerHTML = `TEMPO: ${valor}`;
} 

function generateCeryt() {
    let beat1 = notasList[Math.round(Math.random() * 3)];
    let beat2 = notasList[Math.round(Math.random() * 3)];
    let beat3 = notasList[Math.round(Math.random() * 3)];
    let beat4 = notasList[Math.round(Math.random() * 3)];
    document.getElementById("frame").innerHTML = `<p class="ceryt">${notas[beat1]} ${notas[beat2]} ${notas[beat3]} ${notas[beat4]}</p>`;
}

