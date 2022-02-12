class animation {
    constructor(imagenes, speed) {
        this.img = imagenes;
        this.stop = true;
        this.count = 0;
        this.frames = 0;
        this.speed = speed;
        this.index;
        this.countReset = 0;
        this.comienzo = -1;
        this.final = -1;
    }
    Update(comienzo, final) {
        if (!this.stop) this.frames += this.speed;
        if (this.frames >= final + 1 || this.frames < comienzo) {
            this.frames = comienzo;
            if (this.comienzo == comienzo && this.final == final) {
                this.countReset += 1;
            } else {
                this.countReset = 0;
            }
        }
        this.index = Math.floor(this.frames) % this.img.length;
        this.comienzo = comienzo;
        this.final = final;
    }
    Draw(ctx, x, y, w, h, mode) {

        if (mode == "player") {
            ctx.drawImage(this.img[this.index], 0, 0, w, h, x -10, y, 54, 62);
        }
        else if(mode == "cloud"){
            ctx.drawImage(this.img[this.index], 0, 0, w, h, x, y, 300, 150);
        }
        else {
            if (this.img[this.index] && mode == 'resize' && w && h) {
                ctx.drawImage(this.img[this.index], 0, 0, w, h, x, y, 32, 32);
            } else if (this.img[this.index] && !mode && w != undefined && h != undefined) {
                ctx.drawImage(this.img[this.index], 0, 0, w, h, x - 2, y + 5, 54, 62);
            } else if (this.img[this.index] && (!mode && !w && !h) && this.img.length > 0 && this.img[this.index]) {
                ctx.drawImage(this.img[this.index], x, y);
            }
        }

    }
}