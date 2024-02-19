/* INITS */

const tapBtn = document.getElementById("btn-tap");
const toggleButton = document.querySelector("#btn-toggle");
const playButton = document.getElementById("btn-play");
const timeLog = document.getElementById("time-log");
const modal = document.querySelector(".modal");

var envelope = null
var pattern = [];
var globalTempo;
var tempoM;
var negraDuration = 1;
var corcheaDuration = 0.5;
var semiDuration = 0.25;
var lastDate = null;

var audioCtx = null;
var noiseBuffer = null;
var peakFilter = null;
var biquadFilter = null;
var distortion = null;
var gain = null;
var stick = document.getElementById("stick");

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

// ACTUALIZACION DE TEMPO
function showTempo(valor) {
    document.getElementById("tempo-label").innerHTML = `TEMPO: <b>${valor}</b>`;
    globalTempo = valor;
    tempoM = 60 / valor;
} 

showTempo(document.getElementById("tempo").value);

// GENERAR CELULA RITMICA
function generateCeryt() {
    let beat1 = notasList[Math.round(Math.random() * 4)];
    let beat2 = notasList[Math.round(Math.random() * 4)];
    let beat3 = notasList[Math.round(Math.random() * 4)];
    let beat4 = notasList[Math.round(Math.random() * 4)];
    pattern = [beat1, beat2, beat3, beat4];
    document.getElementById("frame").innerHTML = `<p class="ceryt">${notas[beat1]} ${notas[beat2]} ${notas[beat3]} ${notas[beat4]}</p>`;
}

// EJECUTAR SONIDO BEEP
function beep(ini, end) {
    let osc = audioCtx.createOscillator();
    osc.connect(biquadFilter);
    osc.start(ini);
    osc.stop(end);
}

// EJECUTAR SONIDO NOISE
function click() {
    let noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.start(audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(3.5, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(1, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
    noise.connect(biquadFilter);
}

// EJECUTAR PATRON CON CLICK
function playPatternClick(array) {
    let totalTime = 0;
    array.forEach(elem => {
        switch (elem) {
            case "negra":
                setTimeout(() => {
                    click()
                }, audioCtx.currentTime + totalTime);
                totalTime += tempoM * 1000;
                break;
            case "doblecorchea":
                for (let i = 0; i < 2; i++) {
                    setTimeout(() => {
                        click() 
                    }, audioCtx.currentTime + totalTime);
                    totalTime += tempoM * 500;
                }
                break;
            case "semis":
                for (let i = 0; i < 4; i++) {
                    setTimeout(() => {
                        click() 
                    }, audioCtx.currentTime + totalTime);
                    totalTime += tempoM * 250;
                }
                break;
            case "semiCor":
                for (let i = 0; i < 2; i++) {
                    setTimeout(() => {
                        click() 
                    }, audioCtx.currentTime + totalTime);
                    totalTime += tempoM * 250;
                }
                setTimeout(() => {
                        click() 
                    }, audioCtx.currentTime + totalTime);
                totalTime += tempoM * 500;
                break;
            case "corSemi":
                setTimeout(() => {
                        click() 
                    }, audioCtx.currentTime + totalTime);
                totalTime += tempoM * 500;
                for (let i = 0; i < 2; i++) {
                    setTimeout(() => {
                        click() 
                    }, audioCtx.currentTime + totalTime);
                    totalTime += tempoM * 250;
                }
                break;
        }
    });
}

// EJECUTAR PATRON CON BEEP
function playPattern(array) {
    let totalTime = 0;
    array.forEach(elem => {
        switch (elem) {
            case "negra":
                beep(audioCtx.currentTime + totalTime, audioCtx.currentTime + totalTime + tempoM * 0.9);
                totalTime += tempoM * 1;
                break;
            case "doblecorchea":
                for (let i = 0; i < 2; i++) {
                    beep(audioCtx.currentTime + totalTime, audioCtx.currentTime + totalTime + tempoM * 0.4);
                    totalTime += tempoM * 0.5;
                }
                break;
            case "semis":
                for (let i = 0; i < 4; i++) {
                    beep(audioCtx.currentTime + totalTime, audioCtx.currentTime + totalTime + tempoM * 0.2);
                    totalTime += tempoM * 0.25;
                }
                break;
            case "semiCor":
                for (let i = 0; i < 2; i++) {
                    beep(audioCtx.currentTime + totalTime, audioCtx.currentTime + totalTime + tempoM * 0.2);
                    totalTime += tempoM * 0.25;
                }
                beep(audioCtx.currentTime + totalTime, audioCtx.currentTime + totalTime + tempoM * 0.4);
                totalTime += tempoM * 0.5;
                break;
            case "corSemi":
                beep(audioCtx.currentTime + totalTime, audioCtx.currentTime + totalTime + tempoM * 0.4);
                totalTime += tempoM * 0.5;
                for (let i = 0; i < 2; i++) {
                    beep(audioCtx.currentTime + totalTime, audioCtx.currentTime + totalTime + tempoM * 0.2);
                    totalTime += tempoM * 0.25;
                }
                break;
        }
    });
}


// EJECUTAR PATRON CON STICK
function playPatternStick(array) {
    let totalTime = 0;
    array.forEach(elem => {
        switch (elem) {
            case "negra":
                setTimeout(() => {
                    stick.play()
                }, totalTime);
                totalTime += tempoM * 1000;
                break;
            case "doblecorchea":
                for (let i = 0; i < 2; i++) {
                    setTimeout(() => {
                        stick.play() 
                    },totalTime);
                    totalTime += tempoM * 500;
                }
                break;
            case "semis":
                for (let i = 0; i < 4; i++) {
                    setTimeout(() => {
                        stick.play() 
                    },totalTime);
                    totalTime += tempoM * 250;
                }
                break;
            case "semiCor":
                for (let i = 0; i < 2; i++) {
                    setTimeout(() => {
                        stick.play() 
                    },totalTime);
                    totalTime += tempoM * 250;
                }
                setTimeout(() => {
                        stick.play() 
                    },totalTime);
                totalTime += tempoM * 500;
                break;
            case "corSemi":
                setTimeout(() => {
                        stick.play() 
                    },totalTime);
                totalTime += tempoM * 500;
                for (let i = 0; i < 2; i++) {
                    setTimeout(() => {
                        stick.play() 
                    },totalTime);
                    totalTime += tempoM * 250;
                }
                break;
        }
    });
}


toggleButton.addEventListener(
  "click",
  () => {
    audioCtx = new AudioContext();
    initClick();
    modal.style.opacity = 0;
    modal.style.zIndex = -1;
    },
  false,
);

function initClick() {
    noiseBuffer = audioCtx.createBuffer(1, 1320, 44000);
    for (var i = 0; i < 44000; i++) {
        noiseBuffer.getChannelData(0)[i] = Math.random() * 2 - 1;
    }
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "bandpass";
    biquadFilter.frequency.setValueAtTime(2500, audioCtx.currentTime);
    biquadFilter.Q.setValueAtTime(0.7, audioCtx.currentTime);
    biquadFilter.gain.setValueAtTime(50, audioCtx.currentTime);

    distortion = audioCtx.createWaveShaper();
    const k = 500;
    const n_samples = 44000;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; i++) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    distortion.curve = curve;

    peakFilter = audioCtx.createBiquadFilter();
    peakFilter.type = "peaking";
    peakFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    peakFilter.gain.setValueAtTime(50, audioCtx.currentTime);

    gain = audioCtx.createGain();
    gain.gain.setValueAtTime(1, audioCtx.currentTime);

    biquadFilter.connect(distortion);
    distortion.connect(peakFilter);
    peakFilter.connect(audioCtx.destination);
    // gain.connect(audioCtx.destination);
}

playButton.addEventListener(
    "click",
    () => {
      playPattern(pattern);
      },
    false,
  );

tapBtn.addEventListener("mousedown",
    () => {
        let delta = 0;
        stick.play();
        if (lastDate == null) {
            lastDate = new Date();
        } else {
            let currDate = new Date();
            delta = currDate - lastDate;
            console.log(delta);
            lastDate = currDate;
        }
    });

window.addEventListener("keydown",
    (event) => {
        if (event.key == " ") {
            let delta = 0;
            stick.play();
            if (lastDate == null) {
                lastDate = new Date();
            } else {
                let currDate = new Date();
                delta = currDate - lastDate;
                console.log(delta);
                lastDate = currDate;
            }
        }
    }
);

