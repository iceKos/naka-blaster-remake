class cloud {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.animaciones = new animation(animationManager.imagenes["cloud"], 0.05);
        this.animaciones.stop = false;
    }

    Draw(ctx) {
        if (camera.x - 32 < this.x && camera.x + camera.w > this.x &&
            camera.y - 32 < this.y && camera.y + camera.h > this.y) {
            if (this.animaciones.img[0] != null) {
                this.animaciones.Draw(ctx, this.x, this.y, 1000, 1000, "cloud");
            }
        }
    }
    Update() {
        this.x -= 0.5

        if (this.x < -500) {
            this.x = getRandomInt(-500, canvas.width)
        }
        this.animaciones.Update(0, 3);
    }
}