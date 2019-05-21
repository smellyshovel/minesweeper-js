import ImageSources from "./assets/cells/*.svg";
const Images = {};

for (let name in ImageSources) {
    let img = new Image();
    img.src = ImageSources[name];

    Images[name] = img;
}

export default class Cell {
    constructor(field, x, y) {
        this.field = field;
        this.x = x;
        this.y = y;

        this.image = Images.closed;

        this.closed = true;
        this.flagged = false;
        this.doubted = false;

        this.mine = false;
        this.value = 0;
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

    draw() {
        this.field.context.drawImage(
            this.image,
            this.bounds.left,
            this.bounds.top,
            this.size,
            this.size
        );
    }

    open() {
        if (!this.field.game.started) {
            this.field.mineCells([this, ...this.neighbours]);
            this.field.game.dispatch("start", this);
        }

        (function openCell(cell) {
            if (!cell.closed || cell.flagged || cell.doubted) return;

            if (cell.mine) {
                cell.field.minedCells.forEach(minedCell => {
                    minedCell.image = Images.mine;
                });

                cell.image = Images.trigger;
                cell.closed = false;
            } else {
                cell.image = Images[cell.value];
                cell.closed = false;

                if (cell.value === 0) {
                    cell.neighbours.forEach(neighbour => openCell(neighbour));
                }
            }
        })(this);

        this.field.game.checkState();
    }

    flag(force) {
        if (this.closed) {
            if (!this.flagged && !this.doubted) { // closed but not flagged nor doubted
                this.flagged = true;
                this.image = Images.flag;
            } else if (this.flagged) { // already flagged
                this.flagged = false;
                this.doubted = true;
                this.image = Images.doubt;
            } else if (this.doubted) { // already doubted
                this.doubted = false;
                this.image = Images.closed;
            }
        }

        if (force) {
            this.doubted = false;
            this.flagged = true;
            this.image = Images.flag;
        }
    }

    leftUp() {
        this.open();
    }

    rightUp() {
        this.flag();
    }

    middleUp() {
        if (this.value) {
            let flaggedNeighbours = this.neighbours.filter(neighbour => {
                return neighbour.flagged;
            });

            if (flaggedNeighbours.length === this.value) {
                this.neighbours.forEach(neighbour => {
                    neighbour.open();
                });
            }
        }
    }
}
