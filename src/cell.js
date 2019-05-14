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
    }

    draw(size) {
        console.dir(Images.closed);
        this.field.context.drawImage(Images.closed, this.x * size, this.y * size, size, size);
    }
}
