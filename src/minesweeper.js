import Field from "./field";

export default class Minesweeper {
    constructor({
        canvas, // a <canvas> DOM element
        width = 9, // number of cells by the X axis
        height = 9, // number of cells by the Y axis
        mines = 10 // number of mines on the field
    }) {
        if (width < 5) {
            throw new Error("The field must be at least 5 cells wide");
        }

        if (height < 5) {
            throw new Error("The field must be at least 5 cells high");
        }

        if (mines < 1) {
            throw new Error("There must be at least 1 mine on the field");
        }

        if (mines > width * height - 10) {
            throw new Error(`There might be at maximum ${ width * height - 10 } mines for the ${ width }×${ height } field`);
        }

        this.eventListeners = {};

        this.field = new Field({
            game: this,
            canvas,
            width,
            height,
            mines
        });

        this
        .on("start", () => {
            this.started = true;
        })
        .on("end", () => {
            this.ended = true;
        });
    }

    checkState() {
        let win = this.field.closedCells.every(cell => cell.mine);
        let lose = this.field.openedCells.some(cell => cell.mine);

        if (win || lose) {
            this.dispatch("end", win ? "won" : "lost");
        }
    }

    on(event, listener) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(listener);

        return this;
    }

    dispatch(event, ...params) {
        this.eventListeners[event].forEach(listener => {
            if (typeof listener === "function") {
                listener.call(this, ...params);
            }
        });
    }
}
