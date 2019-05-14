import Cell from "./cell";

export default class Field {
    constructor({ game, canvas, ...props }) {
        this.game = game;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.props = props;

        this.initCells();
        this.determineCellSize();

        this.draw();
    }

    initCells() {
        this.cells = Array.from(new Array(this.props.width * this.props.height), (i, n) => {
            let x = n % this.props.width;
            let y = (n - x) / this.props.width;

            return new Cell(this, x, y);
        });
    }

    determineCellSize() {
        this.cellSize = Math.min(
            this.canvas.width / this.props.width,
            this.canvas.height / this.props.height
        );
    }

    draw() {
        this.cells.forEach(cell => cell.draw(this.cellSize));
    }
}
