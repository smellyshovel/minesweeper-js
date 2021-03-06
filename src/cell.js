export default class Cell {
    constructor(field, x, y) {
        this.field = field;

        this.x = x;
        this.y = y;

        this._image = this.Images.closed;

        this.isMined = false;
        this.value = 0;

        this.isClosed = true;
        this.isFlagged = false;
        this.isDoubted = false;
    }

    get Images() {
        return this.field.theme;
    }

    set image(val) {
        this._image = this.Images[`${ val }`];
        this.draw();
    }

    set tempImage(val) {
        let currentImage = this._image;
        this.image = val;
        this._image = currentImage;
    }

    get bounds() {
        let offsetX = (this.field.canvas.width - this.field.props.width * this.size) / 2;
        let offsetY = (this.field.canvas.height - this.field.props.height * this.size) / 2;

        return {
            left: this.x * this.size + offsetX,
            right: this.x * this.size + this.size + offsetX,
            top: this.y * this.size + offsetY,
            bottom: this.y * this.size + this.size + offsetY
        };
    }

    get size() {
        return Math.min(
            this.field.canvas.width / this.field.props.width,
            this.field.canvas.height / this.field.props.height
        );
    }

    get isOpened() {
        return !this.isClosed;
    }

    draw() {
        this.field.context.drawImage(
            this._image,
            this.bounds.left,
            this.bounds.top,
            this.size,
            this.size
        );
    }

    open() {
        if (!this.field.game.isStarted) {
            this.field.mineCells([this, ...this.neighbours]);
            this.field.game.dispatch("start", this.field.game);
        }

        (function openCell(cell, isRecursive) {
            if (cell.isOpened || cell.isFlagged || cell.isDoubted) return;

            if (cell.isMined) {
                cell.isClosed = false;
            } else {
                cell.image = `${ cell.value }`;
                cell.isClosed = false;

                if (cell.value === 0) {
                    cell.neighbours.forEach(neighbour => openCell(neighbour, true));
                }
            }

            if (!isRecursive) {
                cell.field.game.dispatch("cellopen", cell);
            }
        })(this);
    }

    flag(force) {
        if (this.isClosed) {
            if (!this.isFlagged && !this.isDoubted) { // closed but not flagged nor doubted
                this.isFlagged = true;
                this.image = "flag";
            } else if (this.isFlagged) { // already flagged
                this.isFlagged = false;
                this.isDoubted = true;
                this.image = "doubt";
            } else if (this.isDoubted) { // already doubted
                this.isDoubted = false;
                this.image = "closed";
            }
        }

        if (force) {
            this.isDoubted = false;
            this.isFlagged = true;
            this.image = "flag";
        }

        this.field.game.dispatch("cellflag", this);
    }

    leftDown() {
        if (this.isClosed && !this.isFlagged && !this.isDoubted) {
            this.tempImage = "0";
        }
    }

    leftUp() {
        if (this.isClosed && !this.isFlagged && !this.isDoubted) {
            this.open();
        }
    }

    rightUp() {
        this.flag();
    }

    middleDown() {
        this.neighbours.forEach(neighbour => {
            if (neighbour.isClosed && !neighbour.isFlagged && !neighbour.isDoubted) {
                neighbour.tempImage = "0";
            }
        });
    }

    middleUp() {
        if (this.isOpened && this.value) {
            let flaggedNeighbours = this.neighbours.filter(neighbour => neighbour.isFlagged);

            if (flaggedNeighbours.length === this.value) {
                this.neighbours.forEach(neighbour => neighbour.open());
            }
        }

        this.field.draw();
    }
}
