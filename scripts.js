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

const tapBtn = document.getElementById("btn-tap");
const toggleButton = document.querySelector("#btn-toggle");
var osc = null;
var audioCtx = null;
var pattern = []; 

function showTempo(valor) {
    document.getElementById("tempo-label").innerHTML = `TEMPO: ${valor}`;
} 

function generateCeryt() {
    let beat1 = notasList[Math.round(Math.random() * 3)];
    let beat2 = notasList[Math.round(Math.random() * 3)];
    let beat3 = notasList[Math.round(Math.random() * 3)];
    let beat4 = notasList[Math.round(Math.random() * 3)];
    pattern = [beat1, beat2, beat3, beat4];
    document.getElementById("frame").innerHTML = `<p class="ceryt">${notas[beat1]} ${notas[beat2]} ${notas[beat3]} ${notas[beat4]}</p>`;
}

function beep() {
    osc = audioCtx.createOscillator();
    osc.frequency.value = 440;
    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function negra() {
    osc = audioCtx.createOscillator();
    osc.frequency.value = 440;
    osc.connect(audioCtx.destination);
    osc.start();
    let duration = 60 / tempo.value;
    osc.stop(audioCtx.currentTime + duration);
    return duration;
}

function corchea() {
    osc = audioCtx.createOscillator();
    osc.frequency.value = 440;
    osc.connect(audioCtx.destination);
    osc.start();
    let duration = 60 / (tempo.value * 2);
    osc.stop(audioCtx.currentTime + duration);
    return duration;
}

function semiCorchea() {
    osc = audioCtx.createOscillator();
    osc.frequency.value = 440;
    osc.connect(audioCtx.destination);
    osc.start();
    let duration = 60 / (tempo.value * 4);
    osc.stop(audioCtx.currentTime + duration);
    return duration;
}

function playPattern(array) {
    let wait = 0;
    array.forEach(elem => {
        switch (elem) {
            case "negra":
                setTimeout(() => {
                    wait = negra() * 1000;
                }, wait);
                break;
            case "doblecorchea":
                setTimeout(() => {
                    wait = corchea() * 1000;
                }, wait);
                setTimeout(() => {
                    wait = corchea() * 1000;
                }, wait);
                break;
            case "semis":
                setTimeout(() => {
                    wait = negra() * 1000;
                }, wait);
                break;
            case "semiCor":
                setTimeout(() => {
                    wait = negra() * 1000;
                }, wait);
                break;
        }
    });
}

toggleButton.addEventListener(
  "click",
  () => {
    audioCtx = new AudioContext();
    toggleButton.style.backgroundColor = "rgb(250 90 90 / 90%)";
    },
  false,
);

tapBtn.addEventListener("mousedown", beep);

