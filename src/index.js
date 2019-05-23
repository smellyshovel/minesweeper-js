import Minesweeper from "./minesweeper";

let game = new Minesweeper({
    canvas: document.querySelector("canvas#minesweeper"),
    width: 30,
    height: 16,
    mines: 99
});

let pauseButton = document.querySelector("#pause");

pauseButton.addEventListener("click", (event) => {
    if (pauseButton.disabled) return;

    if (game.isPaused) {
        game.resume();
    } else {
        game.pause();
    }
});

let flagsCounterElement = document.querySelector("#flags-counter");
flagsCounterElement.innerHTML = `0 / 12`;

game
.on("start", (game) => {
    console.log(`The #${ game.field.canvas.id } game has started`);
    pauseButton.disabled = false;
})
.on("cellopen", (cell) => {
    console.log(`The [${ cell.x }, ${ cell.y }] cell has been opened`);
})
.on("cellflag", (cell) => {
    console.log(`The [${ cell.x }, ${ cell.y }] cell has been flagged`);
    flagsCounterElement.innerHTML = `${ game.field.flaggedCells.length } / 12`;
})
.on("pause", () => {
    console.log("The game is paused.");
    pauseButton.innerHTML = "Resume";
})
.on("resume", () => {
    console.log("The game is resumed.");
    pauseButton.innerHTML = "Pause";
})
.on("end", (result) => {
    if (result === "won") {
        console.log("You won! Congratulations!");
    } else if (result === "lost") {
        console.log("You lost :( Better luck next time!");
    }

    pauseButton.disabled = true;
});
