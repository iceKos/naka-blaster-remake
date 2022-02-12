class bomb {
    constructor(x, y, time, large,id) {
        this.id = id
        this.x = x;
        this.y = y;
        this.time = time;
        this.large = large;
        this.animaciones = new animation(animationManager.imagenes["bomb"], 0.4);
        this.animaciones.stop = false;
        this.ancho = 32;
        this.alto = 32;
        this.tmp = null;
        this.recienColocada = true;
        this.coloca = null;
        this.hitbox = new rectangulo(this.x, this.y, this.ancho, this.alto);
        this.timestamp = new Date().getTime()
        this.kick_status = false
    }

    Draw(ctx) {
        if (camera.x - 32 < this.x && camera.x + camera.w > this.x &&
            camera.y - 32 < this.y && camera.y + camera.h > this.y) {
            if (this.animaciones.img[0] != null) {
                this.animaciones.Draw(ctx, this.x, this.y - 10);
                if (debug.hit) this.hitbox.Draw(ctx);
            }
        }
    }
    Update() {
        this.animaciones.Update(0, 3);

    }
}