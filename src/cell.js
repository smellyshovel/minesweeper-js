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
        this.save();

        this.closed = true;
        this.mine = false;
        this.value = 0;
    }

    get bounds() {
        return {
            left: this.x * this.size,
            right: this.x * this.size + this.size,
            top: this.y * this.size,
            bottom: this.y * this.size + this.size
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

    save() {
        this.prevImage = this.image;
    }

    reset() {
        this.image = this.prevImage;
    }

    open() {
        if (this.closed) {
            if (!this.field.game.started) {
                this.field.fillCells(this);
                this.field.game.start();
            }

            if (this.value === 0) {
                this.image = Images.opened;
                this.neighbours.forEach(neighbour => {
                    neighbour.open();
                });
            } else if (this.value) {
                this.image = Images[this.value];
            } else if (this.mine) {
                console.log("lost");
                return;
            }
        }
    }

    leftDown() {
        if (this.closed && !this.flagged && !this.doubted) {
            this.save();
            this.image = Images.opened; // substitute the image
        }
    }

    leftUp() {
        if (this.closed && !this.flagged && !this.doubted) {
            this.open();
            this.save();
        }
    }

    rightUp() {
        if (this.closed) {
            if (!this.flagged && !this.doubted) { // closed but not flagged nor doubted
                this.flagged = true;
                this.image = Images.flag;
            } else if (this.flagged) { // already flagged
                this.flagged = false;
                this.doubted = true;
                this.image = Images.doubt;
            } else if (this.doubted) {
                this.doubted = false;
                this.image = Images.closed;
            }
            
            this.save();
        }
    }

    middleDown() {
        this.reset();

        this.neighbours.forEach(neighbour => {
            if (neighbour.closed && !neighbour.flagged && !neighbour.doubted) {
                neighbour.save();
                neighbour.image = Images.opened;
            }
        });
    }

    middleUp() {
        if (!this.closed && this.value > 0) {
            let numberOfFalgged = this.neighbours.filter(neighbour => {
                return neighbour.flagged;
            }).length;

            if (this.value === numberOfFalgged) {
                this.neighbours.forEach(neighbour => {
                    neighbour.open();
                });
            }
        }
    }
}
