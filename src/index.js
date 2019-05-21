import Minesweeper from "./minesweeper";

let game = new Minesweeper({
    canvas: document.querySelector("canvas#minesweeper"),
    width: 30,
    height: 16,
    mines: 11
});

game
.on("start", () => {
    console.log("The game has started!");
})
.on("end", (result) => {
    if (result === "won") {
        console.log("You won! Congratulations!");
    } else if (result === "lost") {
        console.log("You lost :( Better luck next time!");
    }
})
.on("pause", () => {
    console.log("The game is paused.");
})
.on("resume", () => {
    console.log("The game is resumed.");
})
