const notasList = [
    "negra",
    "doblecorchea"
]

const notas = {
    negra : "&#9833;",
    doblecorchea : "&#9835;"
}

function showTempo(valor) {
    document.getElementById("tempo-label").innerHTML = `TEMPO: ${valor}`;
} 

function generateCeryt() {
    let beat1 = notasList[Math.round(Math.random())];
    let beat2 = notasList[Math.round(Math.random())];
    let beat3 = notasList[Math.round(Math.random())];
    let beat4 = notasList[Math.round(Math.random())];
    document.getElementById("frame").innerHTML = `<p class="ceryt">${notas[beat1]}${notas[beat2]}${notas[beat3]}${notas[beat4]}</p>`;
}