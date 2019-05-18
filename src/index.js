import Minesweeper from "./minesweeper";

let game = new Minesweeper({
    canvas: document.querySelector("canvas#minesweeper"),
    width: 9,
    height: 9,
    mines: 10
});

game
.on("start", () => {
    console.log("Game has started!");
})
.on("win", () => {
    console.log("You won!");
})
.on("lose", () => {
    console.log("You lost :(");
})
