import Cell from "./cell";

export default class Field {
    constructor({ game, canvas, ...props }) {
        this.game = game;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.props = props;

        this.initCells();
        this.registerEventListeners();
        this.draw();
    }

    initCells() {
        this.cells = Array.from(new Array(this.props.width * this.props.height), (c, i) => {
            let x = i % this.props.width;
            let y = (i - x) / this.props.width;

            return new Cell(this, x, y);
        });

        this.cells.forEach(cell => {
            cell.neighbours = this.cells.filter(neighbour => {
                let xs = [cell.x - 1, cell.x, cell.x + 1];
                let ys = [cell.y - 1, cell.y, cell.y + 1];

                return xs.includes(neighbour.x)
                    && ys.includes(neighbour.y)
                    && cell !== neighbour;
            });
        });
    }

    fillCells(exceptCell) {

    }

    locateCell(offsetX, offsetY) {
        return this.cells.find(cell => {
            return cell.bounds.left < offsetX
                && cell.bounds.right > offsetX
                && cell.bounds.top < offsetY
                && cell.bounds.bottom > offsetY;
        });
    }

    draw() {
        this.cells.forEach(cell => cell.draw());
    }

    reset() {
        this.cells.forEach(cell => cell.reset());
        this.currentCell = null;
    }

    registerEventListeners() {
        this.canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        this.canvas.addEventListener("mousedown", (event) => {
            this.currentCell = this.locateCell(event.offsetX, event.offsetY);

            if (event.buttons === 1) { // left button
                this.currentCell.leftDown();
            } else if (event.buttons > 2 && event.buttons < 8) { // middle or both left and right buttons
                this.currentCell.middleDown();
            }

            this.draw();
        });

        this.canvas.addEventListener("mouseleave", (event) => {
            if (this.currentCell) {
                this.reset();
                this.draw();
            }
        });

        this.canvas.addEventListener("mouseup", (event) => {
            if (this.currentCell) {
                let cell = this.locateCell(event.offsetX, event.offsetY);

                if (cell === this.currentCell) {
                    if (event.buttons === 0) { // no more buttons are down
                        if (event.button === 0) { // left button
                            cell.leftUp();
                        } else if (event.button === 2) { // right button
                            cell.rightUp();
                        } else if (event.button === 1) { // middle button
                            cell.middleUp();
                        }
                    } else if (event.buttons > 0 && event.buttons < 8) { // either left or right button is still down
                        cell.middleUp();
                    }
                }

                this.reset();
                this.draw();
            }
        });
    }
}
