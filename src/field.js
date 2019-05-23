import Cell from "./cell";

export default class Field {
    constructor({ game, canvas, ...props }) {
        this.game = game;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.props = props;

        this.initCells();

        this.eventListeners = new Map();
        this.registerEventListeners();

        this.draw();
    }

    get closedCells() {
        return this.cells.filter(cell => cell.isClosed);
    }

    get openedCells() {
        return this.cells.filter(cell => cell.isOpened);
    }

    get flaggedCells() {
        return this.cells.filter(cell => cell.isFalgged);
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
        let cellsToFill = this.cells.filter(cell => !except.includes(cell));
        this.minedCells = [];

        while (this.minedCells.length < this.props.mines) {
            let cell = cellsToFill[Math.random() * cellsToFill.length | 0];

            if (!cell.isMined) {
                cell.isMined = true;
                this.minedCells.push(cell);
            }
        }

        this.minedCells.forEach(cell => {
            cell.neighbours.forEach(neighbour => neighbour.value += 1);
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
        if (this.game.isPaused) {
            this.context.fillStyle = "#f2f2f2";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.context.textBaseline = 'middle';
            this.context.textAlign = "center";
            this.context.font = `2em Helvetica`;
            this.context.fillStyle = "#828282";
            this.context.fillText("The game is paused.", this.canvas.width / 2, this.canvas.height / 2);
        } else {
            this.context.fillStyle = "#fff";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.cells.forEach(cell => cell.draw());
        }
    }

    registerEventListeners() {
        // no need to ever unregister it
        this.canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        this.eventListeners.set(
            {
                event: "mousedown",
                target: this.canvas
            },

            (event) => {
                this.draw();

                let cell = this.locateCell(event.offsetX, event.offsetY);
                if (!cell) return;

                if (event.buttons === 1) { // left button
                    cell.leftDown();
                } else if (event.buttons > 2 && event.buttons < 8) { // middle or both left and right buttons
                    cell.middleDown();
                }
            }
        );

        this.eventListeners.set(
            {
                event: "mouseleave",
                target: this.canvas
            },

            (event) => this.draw()
        );

        this.eventListeners.set(
            {
                event: "mouseup",
                target: this.canvas
            },

            (event) => {
                let cell = this.locateCell(event.offsetX, event.offsetY);
                if (!cell) return;

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
        );

        this.eventListeners.forEach((val, key) => {
            key.target.addEventListener(key.event, val);
        });
    }

    unregisterEventListeners() {
        this.eventListeners.forEach((val, key) => {
            key.target.removeEventListener(key.event, val);
        });

        this.eventListeners.clear();
    }
}
