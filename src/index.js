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

let game;

function startNewGame() {
    if (game) game = game.destroy();

    game = new Minesweeper({
        canvas: document.querySelector("#minesweeper"),
        width: Settings.width,
        height: Settings.height,
        mines: Settings.mines
    });
};

startNewGame();

document.querySelector("#start").addEventListener("click", function() {
    if (game.isStarted && !game.isEnded && confirm("Are you sure?")) {
        startNewGame();
    }
});
