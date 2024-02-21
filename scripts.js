/* INITS */

const tapBtn = document.getElementById("btn-tap");
const toggleButton = document.querySelector("#btn-toggle");
const playButton = document.getElementById("btn-play");
const genButton = document.getElementById("btn-generar");
const modal = document.querySelector(".modal");
const tutoCtrl = document.getElementById("tuto-control");
const tutoBtn = document.getElementById("btn-tuto");
const tutoPrev = document.getElementById("prev");
const tutoNext = document.getElementById("next");
const tutoWindow = document.getElementById("tuto-window");
const score = document.getElementById("score-number");
const finalScore = document.getElementById("final-score");
const levelSign = document.getElementById("level-sign");
const winBkg = document.getElementById("win-bkg");
const winModal = document.getElementById("win-modal");
    
var pattern = [];
var sequence = [];
var taps = [];
var tapDates = [];
var ceryt = [];
let page = 0;

let waves = document.querySelectorAll(".wave");
var globalTempo;
var tempoM;
var tolerance = 0;
var delta = firstDelta = lastTap = sequenceIndex = 0;
var negraMs = 0;
var scoreTotal = errorRate = 0;
var controlInterval = null;
var currAnswer = false;
var variantes = level = 1;
var firstTry = true;

var audioCtx = null;
var buffer = null;
var stick = document.getElementById("stick");
var right = document.getElementById("right");
var wrong = document.getElementById("wrong");
var levelup = document.getElementById("level-up");
var winSound = document.getElementById("win");

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

let pages = ["Este botón genera un ritmo de cuatro pulsos",
            "Esta ventana muestra el ritmo creado",
            "Este botón es para que toques el ritmo",
            `Este botón te permite escuchar el ritmo antes de tocarlo
            (podés cambiar la velocidad con la barra de tempo)`];

tutoWindow.innerHTML = pages[page];

// ACTUALIZACION DE TEMPO
function showTempo(valor) {
    document.getElementById("tempo-label").innerHTML = `TEMPO: <b>${valor}</b>`;
    globalTempo = valor;
    tempoM = 60 / valor;
} 
showTempo(document.getElementById("tempo").value);

// GENERAR CELULA RITMICA
function generateCeryt() {
    if (currAnswer) {
        currAnswer = false;
        delta = firstTap = lastTap = 0;
        emptyArray(taps);
        frame.style.backgroundColor = "transparent";
        tapBtn.style.zIndex = 1;
        tapBtn.style.opacity = 1;
        tapBtn.style.backgroundColor = "transparent";
    }
    let beat1 = notasList[Math.round(Math.random() * variantes)];
    let beat2 = notasList[Math.round(Math.random() * variantes)];
    let beat3 = notasList[Math.round(Math.random() * variantes)];
    let beat4 = notasList[Math.round(Math.random() * variantes)];
    pattern = [beat1, beat2, beat3, beat4];
    updateSequence();
    document.getElementById("frame").innerHTML = 
        `<p class="ceryt">${notas[beat1]}</p>
        <p class="ceryt">${notas[beat2]}</p>
        <p class="ceryt">${notas[beat3]}</p>
        <p class="ceryt">${notas[beat4]}</p>`;
    genButton.value = "Generar";
    genButton.classList.remove("continuar");
    if (firstTry) {
        genButton.classList.remove("blink");
        tapBtn.style.zIndex = 1;
        tapBtn.classList.add("blink");
    }
    ceryt = document.querySelectorAll(".ceryt");
    ceryt.forEach(elem => {
        elem.classList.add("flip");
        setTimeout(() => {
            elem.classList.remove("flip")
        }, 200);
    });
}

function updateSequence() {
    emptyArray(sequence);
    pattern.forEach(elem => {
        switch (elem) {
            case "negra":
                sequence.push(1);
                break;
            case "doblecorchea":
                sequence.push(0.5,0.5);
                break;
            case "semis":
                sequence.push(0.25,0.25,0.25,0.25);
                break;
            case "semiCor":
                sequence.push(0.25,0.25,0.5);
                break;
            case "corSemi":
                sequence.push(0.5,0.25,0.25);
                break;
        }
    })
}

function emptyArray(array) {
    while (array.length > 0) {
        array.pop();
    }
}

function stickPlay(delay) {
    delay ??= 0;
    let source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.setValueAtTime(1, audioCtx.currentTime);
    source.connect(audioCtx.destination);
    source.start(audioCtx.currentTime + delay);
}

// EJECUTAR PATRON
function playPattern(array) {
    let totalTime = 0;
    let lastTime = 0;
    let counter = 1;
    array.forEach(elem => {
        let beat = document.querySelector(`#frame :nth-child(${counter})`);
        setTimeout(() => {
            beat.style.color = "white";
        }, lastTime * 1000);
        counter++;
        switch (elem) {
            case "negra":
                stickPlay(totalTime);
                totalTime += tempoM * 1;
                break;
            case "doblecorchea":
                for (let i = 0; i < 2; i++) {
                    stickPlay(totalTime);
                    totalTime += tempoM * 0.5;
                }
                break;
            case "semis":
                for (let i = 0; i < 4; i++) {
                    stickPlay(totalTime);
                    totalTime += tempoM * 0.25;
                }
                break;
            case "semiCor":
                for (let i = 0; i < 2; i++) {
                    stickPlay(totalTime);
                    totalTime += tempoM * 0.25;
                }
                stickPlay(totalTime);
                totalTime += tempoM * 0.5;
                break;
            case "corSemi":
                stickPlay(totalTime);
                totalTime += tempoM * 0.5;
                for (let i = 0; i < 2; i++) {
                    stickPlay(totalTime);
                    totalTime += tempoM * 0.25;
                }
                break;
        }
        setTimeout(() => {
            beat.style.color = "black";
        }, totalTime * 1000);
        lastTime = totalTime;
    });
}

toggleButton.addEventListener(
  "click",
  () => {
    audioCtx = new AudioContext();
    initBuffer();
    genButton.classList.add("blink");
    modal.style.opacity = 0;
    modal.style.zIndex = -1;
    },
  false,
);

function initBuffer() {
    const request = new XMLHttpRequest();
    request.open("GET", "./sounds/stick.mp3");
    request.responseType = "arraybuffer";
    request.onload = function() {
    let undecodedAudio = request.response;
    audioCtx.decodeAudioData(undecodedAudio, (data) => buffer = data);
  };
  request.send();
}

playButton.addEventListener(
    "click",
    () => {
      playPattern(pattern);
      },
    false,
  );

function checkPattern() {
    let currTap = new Date();
    let check = true;
    if (sequence.length - 2 == taps.length) {
        delta = currTap - lastTap;
        lastTap = currTap;
        checkTaps(check);
    } else if (lastTap == 0) {
        lastTap = new Date();
        return;
    } else if (delta == 0) {
        delta = currTap - lastTap;
        lastTap = currTap;
        firstDelta = delta;
        setNegraDuration(firstDelta);
        taps.push(delta);
        controlInterval = setInterval(checkDelta, 500);
        check = checkTap(delta, sequenceIndex);
    } else {
        delta = currTap - lastTap;
        lastTap = currTap;
        taps.push(delta);
        check = checkTap(delta, sequenceIndex);
    }
}

function checkTap(ms, i) {
    let error = Math.abs(ms - (sequence[i]) * negraMs);
    sequenceIndex++;
    errorRate += error;
    if (error < tolerance) {
        return true;
    }   else {wrongAnswer()}
}

function checkTaps(check) {
    if (check) {
        rightAnswer()
    } else {wrongAnswer()}
}

function setNegraDuration(ms) {
    switch (sequence[0]) {
        case 1:
            negraMs = ms;
            tolerance = negraMs * 0.2;
            break;
        case 0.5:
            negraMs = ms * 2;
            tolerance = negraMs * 0.2;
            break;
        case 0.25:
            negraMs = ms * 4;
            tolerance = negraMs * 0.2;
            break;
    }
}

function checkDelta() {
    let currDate = new Date();
    if ((currDate - lastTap) > 2000 && !(currAnswer)) {
        wrongAnswer();
        clearInterval(controlInterval);
    }
}

function wrongAnswer() {
    tapBtn.style.opacity = 0;
    tapBtn.style.zIndex = -1;
    setTimeout(() => {
        tapBtn.style.opacity = 1;
        tapBtn.style.zIndex = 1;
    }, 1000);
    clearInterval(controlInterval);
    sequenceIndex = 0;
    delta = firstTap = lastTap = 0;
    errorRate /= 2;
    emptyArray(taps);
    wrong.play();
    frame.style.backgroundColor = "rgb(250 9 9 / 70%)";
    setTimeout(() => {
        frame.style.backgroundColor = "transparent";
        tapBtn.style.backgroundColor = "transparent";
    }, 500);
    if (firstTry) {
        tapBtn.classList.remove("blink");
        firstTry = false;
    }
}

function rightAnswer() {
    right.play();
    scoreTotal += Math.max(Math.round(300 - errorRate / 2), 10);
    errorRate = 0;
    frame.style.backgroundColor = "rgb(9 250 9 / 50%)";
    genButton.value = "Continuar";
    genButton.classList.add("continuar");
    tapBtn.style.zIndex = -1;
    tapBtn.style.opacity = 0;
    score.innerHTML = scoreTotal;
    currAnswer = true;
    clearInterval(controlInterval);
    sequenceIndex = 0;
    updateLevel();
    if (firstTry) {
        tapBtn.classList.remove("blink");
        firstTry = false;
    }
}

function updateLevel() {
    if (scoreTotal > 3000 && level == 3) {
        win();
    } else if (scoreTotal > 2000 && level < 3) {
        variantes = level = 3;
        document.body.style.backgroundImage =
        "linear-gradient(45deg, fuchsia, tomato, indianred)";
        levelUp();
    } else if (scoreTotal > 1000 && level < 2) {
        variantes = level = 2;
        document.body.style.backgroundImage =
        "linear-gradient(45deg, goldenrod, orange, crimson)";
        levelUp();
    }
}

function win() {
    winSound.play();
    finalScore.innerHTML = `PUNTAJE: ${scoreTotal}`;
    waves.forEach(elem => {
        elem.style.animation = `
            wave ${(Math.random() * 2 + 0.9)}s linear infinite
        `
    })
    winBkg.style.animation = "movingBkg 60s linear infinite";
    winBkg.style.zIndex = 1;
    winBkg.style.opacity = 1;
    winModal.style.zIndex = 2;
    winModal.style.opacity = 1;
}

function levelUp() {
    levelup.play();
    levelSign.style.opacity = 1;
    levelSign.style.transform = "scale(7) translateY(-14vh)";
    setTimeout(() => {
        levelSign.style.opacity = 0;
    }, 900);
    setTimeout(() => {
        levelSign.style.transform = "scale(1) translateY(0)";
    }, 1500);
}

function tutorial() {
    tutoBtn.innerHTML = "CERRAR";
    tutoBtn.style.color = "white";
}

tutoPrev.addEventListener("click",
    () => {
        if (page > 0) {
            page--;
            tutoWindow.innerHTML = pages[page];
        }
    });

tutoNext.addEventListener("click",
    () => {
        if (page < pages.length - 1) {
            page++;
            tutoWindow.innerHTML = pages[page];
        }
    });

tapBtn.addEventListener("mousedown",
    () => {
        stickPlay();
        checkPattern();
    });

tutoBtn.addEventListener("click",
    () => {
        tutorial();
    }
    );