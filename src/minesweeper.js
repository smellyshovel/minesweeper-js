import Field from "./field";

export default class Minesweeper {
    constructor({
        canvas, // a <canvas> DOM element
        width = 9, // number of cells by the X axis
        height = 9, // number of cells by the Y axis
        mines = 10 // number of mines on the field
    }) {
        this.eventListeners = {};

        this.field = new Field({
            game: this,
            canvas,
            width,
            height,
            mines
        });
    }

    on(event, listener) {
        this.eventListeners[event] = listener;
    }

    dispatch(event) {
        if (typeof this.eventListeners[event] === "function") {
            this.eventListeners[event].call(this, this);
        }
    }
}
