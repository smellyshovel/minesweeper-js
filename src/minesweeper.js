import Field from "./field";

export default class Minesweeper {
    constructor({
        canvas, // a <canvas> DOM element
        width = 9, // number of cells by the X axis
        height = 9, // number of cells by the Y axis
        mines = 10 // number of mines on the field
    }) {
        // at least 9 free cells for the initial click + 1 to win the game
        if (mines > width * height - 10) throw new Error(`There may be at maximum ${ width * height - 10 } mines for the ${ width }×${ height } field, but ${ mines } is provided`);

        this.eventListeners = {};

        this.field = new Field({
            game: this,
            canvas,
            width,
            height,
            mines
        });

        this.on("start", () => {
            this.started = true;
        }).on("cellsopen", () => {
            this.checkState();
        });
    }

    checkState() {
        let win = this.field.closedCells.every(cell => {
            return cell.mine;
        });

        let lose = this.field.openedCells.some(cell => {
            return cell.mine;
        });

        if (win) {
            this.dispatch("win");
        } else if (lose) {
            this.dispatch("lose");
        }
    }

    on(event, listener) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(listener);
        return this;
    }

    dispatch(event) {
        this.eventListeners[event].forEach(listener => {
            if (typeof listener === "function") {
                listener.call(this, this);
            }
        });
    }
}
