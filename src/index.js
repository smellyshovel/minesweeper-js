import Minesweeper from "./minesweeper";

// if there're no settings then initialize defaults and save them
if (!localStorage.getItem("settings")) {
    localStorage.setItem("settings", JSON.stringify({
        width: 16,
        height: 16,
        mines: 40
    }));
}

// current settings
let settings = JSON.parse(localStorage.getItem("settings"));

let difficultyElement = document.querySelector("#difficulty");
let widthElement = document.querySelector("#width");
let heightElement = document.querySelector("#height");
let minesElement = document.querySelector("#mines");

// insert current values into HTML
widthElement.value = settings.width;
heightElement.value = settings.height;
minesElement.value = settings.mines;

if (settings.width === 9 && settings.height === 9 && settings.mines === 10) {
    difficultyElement.value = "easy";
} else if (settings.width === 16 && settings.height === 16 && settings.mines === 40) {
    difficultyElement.value = "medium";
} else if (settings.width === 30 && settings.height === 16 && settings.mines === 99) {
    difficultyElement.value = "hard";
} else {
    difficultyElement.value = "custom";
}

// update saved settings on difficulty change
difficultyElement.addEventListener("change", function(event) {
    if (this.value === "easy") {
        localStorage.setItem("settings", JSON.stringify({
            width: 9,
            height: 9,
            mines: 10
        }));
    } else if (this.value === "medium") {
        localStorage.setItem("settings", JSON.stringify({
            width: 16,
            height: 16,
            mines: 40
        }));
    } else if (this.value === "hard") {
        localStorage.setItem("settings", JSON.stringify({
            width: 30,
            height: 16,
            mines: 99
        }));
    } else if (this.value === "custom") {
        localStorage.setItem("settings", JSON.stringify({
            width: widthElement.value,
            height: heightElement.value,
            mines: minesElement.value
        }));
    }

    settings = JSON.parse(localStorage.getItem("settings"));
});

// show custom settings inputs when difficulty becomes "custom"
function showCustomSettings() {
    document.querySelector("#settings > .custom").hidden = false;
}

function hideCustomSettings() {
    document.querySelector("#settings > .custom").hidden = true;
}

if (difficultyElement.value === "custom") {
    showCustomSettings();
}

difficultyElement.addEventListener("change", function(event) {
    if (this.value === "custom") {
        showCustomSettings();
    } else {
        hideCustomSettings();
    }
});

// update settings on custom params change
function updateMines() {
    let maxMines = settings.width * settings.height - 10;
    minesElement.max = maxMines;

    if (minesElement.value > maxMines) {
        minesElement.value = maxMines;
    }
}

updateMines();

widthElement.addEventListener("change", function() {
    localStorage.setItem("settings", JSON.stringify({
        width: this.value,
        height: settings.height,
        mines: settings.mines
    }));

    settings = JSON.parse(localStorage.getItem("settings"));
    updateMines();
});

heightElement.addEventListener("change", function() {
    localStorage.setItem("settings", JSON.stringify({
        width: settings.width,
        height: this.value,
        mines: settings.mines
    }));

    settings = JSON.parse(localStorage.getItem("settings"));
    updateMines();
});

minesElement.addEventListener("change", function() {
    localStorage.setItem("settings", JSON.stringify({
        width: settings.width,
        height: settings.height,
        mines: this.value
    }));

    updateMines();
    settings = JSON.parse(localStorage.getItem("settings"));
});

let game = startNewGame();

// when "start new game" button is clicked ask for confirmation if needed and start a new game
document.querySelector("#new").addEventListener("click", function() {
    if (game.isStarted && !game.isEnded && !confirm("Are you sure you want to end the current game?")) return;

    game = game.destroy();
    game = startNewGame();
});

function startNewGame() {
    let game = new Minesweeper({
        canvas: document.querySelector("#minesweeper"),
        ...settings
    });

    let flagsElement = document.querySelector("#flags");
    flagsElement.innerHTML = `0 / ${ settings.mines }`;

    game
    .on("start", () => {

    })
    .on("cellflag", () => {
        flagsElement.innerHTML = `${ game.field.flaggedCells.length } / ${ settings.mines }`;
    })
    .on("end", (result) => {
        console.log(result);
    });

    return game;
}
