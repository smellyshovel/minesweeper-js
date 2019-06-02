const Settings = {
    get defaultPresets() {
        return {
            easy: {
                width: 9,
                height: 9,
                mines: 10
            },

            medium: {
                width: 16,
                height: 16,
                mines: 40
            },

            hard: {
                width: 30,
                height: 16,
                mines: 99
            }
        };
    },

    get difficulty() {
        return localStorage.getItem("difficulty");
    },

    set difficulty(val) {
        localStorage.setItem("difficulty", val);
    },

    get customPreset() {
        return JSON.parse(localStorage.getItem("customPreset"));
    },

    set customPreset(val) {
        localStorage.setItem("customPreset", JSON.stringify(val));
    },

    set customWidth(val) {
        let customPreset = this.customPreset;
        customPreset.width = val;
        this.customPreset = customPreset;
    },

    set customHeight(val) {
        let customPreset = this.customPreset;
        customPreset.height = val;
        this.customPreset = customPreset;
    },

    set customMines(val) {
        let customPreset = this.customPreset;
        customPreset.mines = val;
        this.customPreset = customPreset;
    },

    get width() {
        if (this.difficulty !== "custom") {
            return +this.defaultPresets[this.difficulty].width;
        } else {
            return +this.customPreset.width;
        }
    },

    get height() {
        if (this.difficulty !== "custom") {
            return +this.defaultPresets[this.difficulty].height;
        } else {
            return +this.customPreset.height;
        }
    },

    get mines() {
        if (this.difficulty !== "custom") {
            return +this.defaultPresets[this.difficulty].mines;
        } else {
            return +this.customPreset.mines;
        }
    }
}

if (!Settings.difficulty) {
    Settings.difficulty = "medium";
}

if (!Settings.customPreset) {
    Settings.customPreset = {
        width: 20,
        height: 20,
        mines: 20
    }
}

let difficultyInput = document.querySelector("#difficulty");
let widthInput = document.querySelector("#width");
let heightInput = document.querySelector("#height");
let minesInput = document.querySelector("#mines");

difficultyInput.value = Settings.difficulty;

function updateInputs() {
    widthInput.value = Settings.width;
    heightInput.value = Settings.height;
    minesInput.value = Settings.mines;

    if (Settings.difficulty !== "custom") {
        widthInput.disabled = true;
        heightInput.disabled = true;
        minesInput.disabled = true;
    } else {
        widthInput.disabled = false;
        heightInput.disabled = false;
        minesInput.disabled = false;
    }
}

updateInputs();

function updateMines() {
    minesInput.max = Settings.width * Settings.height - 10;

    if (+minesInput.value > +minesInput.max) {
        minesInput.value = minesInput.max;
    }

    Settings.customMines = minesInput.value;
}

updateMines();

difficultyInput.addEventListener("change", function() {
    Settings.difficulty = this.value;
    updateInputs();
});

widthInput.addEventListener("change", function() {
    Settings.customWidth = this.value;
    updateMines();
});

heightInput.addEventListener("change", function() {
    Settings.customHeight = this.value;
    updateMines();
});

minesInput.addEventListener("change", function() {
    updateMines();
});

import Minesweeper from "./minesweeper";

let timerOutput = document.querySelector("#timer");
timerOutput.value = "00:00";

let timer, time = 0;

function startTimer() {
    timer = setInterval(function() {
        time += 1;
        outputTime();
        // clock =
    }, 1000);
}

function stopTimer(clear) {
    clearInterval(timer);
    if (clear) time = 0, outputTime();
}

function outputTime() {
    let minutes = time / 60 | 0;
    let seconds = time % 60;

    timerOutput.innerHTML = `${ minutes < 10 ? `${ "0" + minutes }` : minutes }:${ seconds < 10 ? `${ "0" + seconds }` : seconds }`;
}

let pauseButton = document.querySelector("#pause");

import ImageSources from "./assets/cells/*.svg";
const Images = {};

for (let name in ImageSources) {
    let img = new Image();
    img.src = ImageSources[name];

    Images[name] = img;
}

let game = startNewGame();

function startNewGame() {
    let game = new Minesweeper({
        canvas: document.querySelector("#minesweeper"),
        theme: {
            ...Images
        },
        width: Settings.width,
        height: Settings.height,
        mines: Settings.mines
    });

    let resultOutput = document.querySelector("#result");
    resultOutput.value = "";

    let flagsOutput = document.querySelector("#flags");
    flagsOutput.value = `0 / ${ Settings.mines }`;

    game
    .on("start", function() {
        startTimer();
        pauseButton.disabled = false;
    })
    .on("pause", function() {
        stopTimer();
        pauseButton.innerHTML = "Resume";
    })
    .on("resume", function() {
        startTimer();
        pauseButton.innerHTML = "Pause";
    })
    .on("cellflag", function() {
        flagsOutput.value = `${ game.field.flaggedCells.length } / ${ Settings.mines }`;
    })
    .on("end", function(result) {
        if (result === "won") {
            resultOutput.value = "You won! Congratulations!";
            resultOutput.classList.add("visible");
        } else if (result === "lost") {
            resultOutput.value = "You lost :(";
            resultOutput.classList.add("visible");
        }

        setTimeout(() => {
            resultOutput.classList.remove("visible");
        }, 2000);

        pauseButton.disabled = true;

        stopTimer();
    });

    return game;
};

document.querySelector("#start").addEventListener("click", function() {
    if (game.isStarted && !game.isEnded && !confirm("Are you sure?")) return;

    game = game.destroy();
    game = startNewGame();

    stopTimer(true);
});

pauseButton.addEventListener("click", function() {
    if (game.isPaused) {
        game.resume();
    } else {
        game.pause();
    }
});

function resizeCanvas() {
    let canvas = document.querySelector("#minesweeper");
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
    game.field.draw();
}

resizeCanvas();

window.addEventListener("resize", function(event) {
    resizeCanvas();
});
