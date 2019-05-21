import Minesweeper from "./minesweeper";

let game = new Minesweeper({
    canvas: document.querySelector("canvas#minesweeper"),
    width: 30,
    height: 16,
    mines: 11
});

let pauseButton = document.querySelector("#pause");

pauseButton.addEventListener("click", (event) => {
    if (pauseButton.disabled) return;

    if (game.paused) {
        game.resume();
    } else {
        game.pause();
    }
});

let timerElement = document.querySelector("#timer");

game
.on("start", () => {
    console.log("The game has started!");
    pauseButton.disabled = false;
})
.on("end", (result) => {
    if (result === "won") {
        console.log("You won! Congratulations!");
    } else if (result === "lost") {
        console.log("You lost :( Better luck next time!");
    }

    pauseButton.disabled = true;
})
.on("pause", () => {
    console.log("The game is paused.");
    pauseButton.innerHTML = "Resume";
})
.on("resume", () => {
    console.log("The game is resumed.");
    pauseButton.innerHTML = "Pause";
})
.on("timerupdate", () => {
    timer.innerHTML = game.timer.round;
})
