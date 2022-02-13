class bomb {
    constructor(x, y, time, large, id) {
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
        this.move_when_kick = false
        this.moveSpeed = 5
        this.nextPosition = {
            x: null,
            y: null
        }
        this.kick_direction = null
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

        if (this.move_when_kick == true && this.nextPosition.x != null && this.nextPosition.y != null && this.kick_direction != null) {
            switch (this.kick_direction) {
                case "TOP_TO_BOTTOM": {
                    // change only y +
                    this.y += this.moveSpeed
                    this.hitbox.y = this.y
                    if (this.y >= this.nextPosition.y) {
                        this.kick_status = false
                        this.move_when_kick = false
                        this.moveSpeed = 5
                        this.nextPosition = {
                            x: null,
                            y: null
                        }
                        this.kick_direction = null
                    }
                    break;
                }
                case "BOTTOM_TO_TOP": {
                    // change only y -
                    this.y -= this.moveSpeed
                    this.hitbox.y = this.y
                    if (this.y <= this.nextPosition.y) {
                        this.kick_status = false
                        this.move_when_kick = false
                        this.moveSpeed = 5
                        this.nextPosition = {
                            x: null,
                            y: null
                        }
                        this.kick_direction = null
                    }
                    break;
                }
                case "LEFT_TO_RIGHT": {
                    // change only x +
                    this.x += this.moveSpeed
                    this.hitbox.x = this.x
                    if (this.x >= this.nextPosition.x) {
                        this.kick_status = false
                        this.move_when_kick = false
                        this.moveSpeed = 5
                        this.nextPosition = {
                            x: null,
                            y: null
                        }
                        this.kick_direction = null
                    }
                    break;
                }
                case "RIGHT_TO_LEFT": {
                    // change only x -
                    this.x -= this.moveSpeed
                    this.hitbox.x = this.x
                    if (this.x <= this.nextPosition.x) {
                        this.kick_status = false
                        this.move_when_kick = false
                        this.moveSpeed = 5
                        this.nextPosition = {
                            x: null,
                            y: null
                        }
                        this.kick_direction = null
                    }
                    break;
                }


                default:
                    break;
            }
        }

    }
}