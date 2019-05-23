import Field from "./field";

export default class Minesweeper {
    constructor({
        canvas, // a <canvas> DOM element
        width = 9, // number of cells by the X axis
        height = 9, // number of cells by the Y axis
        mines = 10 // number of mines on the field
    }) {
        if (width < 5 || width > 50 || height < 5 || height > 50) {
            throw new Error(`Incorrect field size. The field must be from 5×5 to 50×50 cells large, but ${ width }×${ height } is provided`);
        }

        if (mines < 1 || mines > width * height - 10) {
            throw new Error(`Incorrect number of mines. For the ${ width }×${ height } field it must be between 1 and ${ width * height - 10 }, but ${ mines } is provided`);
        }

        // all the event listeners registered using `.on()` are stored here
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
            this.isStarted = true;
        })
        .on("cellopen", (cell) => {
            let won = this.field.closedCells.every(cell => cell.isMined);
            let lost = this.field.openedCells.some(cell => cell.isMined);

            if (won) {
                this.field.minedCells.forEach(cell => cell.flag(true));
                this.dispatch("end", "won");
            } else if (lost) {
                this.field.minedCells.forEach(cell => {
                    if (!cell.isFlagged) cell.image = "mine";
                });

                this.field.flaggedCells.forEach(cell => {
                    if (!cell.isMined) cell.image = "cross";
                });

                cell.image = "trigger";
                this.dispatch("end", "lost");
            }
        })
        .on("pause", () => {
            this.isPaused = true;
            this.field.draw();
            this.field.unregisterEventListeners();
        })
        .on("resume", () => {
            this.isPaused = false;
            this.field.draw();
            this.field.registerEventListeners();
        })
        .on("end", (result) => {
            this.isEnded = true;
            this.field.unregisterEventListeners();
        });
    }

    pause() {
        this.dispatch("pause");
    }

    resume() {
        this.dispatch("resume");
    }

    on(event, listener) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(listener);

        return this;
    }

    dispatch(event, ...params) {
        (this.eventListeners[event] || []).forEach(listener => {
            if (typeof listener === "function") {
                listener.call(this, ...params);
            }
        });
    }
}
