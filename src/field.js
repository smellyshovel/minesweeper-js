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

    get closedCells() {
        return this.cells.filter(cell => {
            return cell.closed;
        });
    }

    get openedCells() {
        return this.cells.filter(cell => {
            return !cell.closed;
        });
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

    mineCells(except) {
        let cellsToFill = this.cells.filter(cell => {
            return !except.includes(cell);
        });

        this.minedCells = [];

        while (this.minedCells.length < this.props.mines) {
            let cell = cellsToFill[Math.random() * cellsToFill.length | 0];

            if (!cell.mine) {
                cell.mine = true;
                this.minedCells.push(cell);
            }
        }

        this.minedCells.forEach(minedCell => {
            minedCell.neighbours.forEach(neighbour => {
                neighbour.value += 1;
            });
        });
    }

    locateCell(offsetX, offsetY) {
        return this.cells.find(cell => {
            return cell.bounds.left <= offsetX
                && cell.bounds.right >= offsetX
                && cell.bounds.top <= offsetY
                && cell.bounds.bottom >= offsetY;
        });
    }

    draw() {
        this.cells.forEach(cell => cell.draw());
    }

    registerEventListeners() {
        this.canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        this.canvas.addEventListener("mouseup", (event) => {
            let cell = this.locateCell(event.offsetX, event.offsetY);

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

            this.draw();
        });
    }
}
