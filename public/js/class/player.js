class player {
    constructor(id, x, y, vel, personaje, posHitX, posHitY, anchoHit, altoHit, numBomb, timeBomb, largeBomb, timeShield = 10000, timeShieldCount = 0) {
        this.imagenes = animationManager.imagenes[personaje];
        this.personaje = personaje;
        this.id = id;
        this.x = x;
        this.power = []
        // this.vel = vel;
        this.vel = vel;
        this.y = y;
        this.posHitX = posHitX;
        this.posHitY = posHitY;
        this.anchoHit = anchoHit;
        this.altoHit = altoHit;
        this.hitbox = new rectangulo(this.x + posHitX, this.y + posHitY, anchoHit, altoHit);
        this.numBomb = numBomb;
        this.numMaxBomb = numBomb;
        this.timeBomb = timeBomb;
        this.largeBomb = largeBomb;
        this.speedImage = (0.09 * this.vel) / 3;
        this.animaciones = new animation(this.imagenes, this.speedImage);
        this.dir = dir.QUIETO;
        this.dirAnterior = dir.QUIETO;
        this.dead = false;
        this.atra = false;
        this.user = "";
        this.shieldAnimation = new animation(animationManager.imagenes["shield"], 0.1)
        this.shieldAnimation.stop = true
        this.undead = true
        this.settimeUndead()
        this.play_sound_hit = false
        this.timeShield = timeShield
        this.timeShieldCount = timeShieldCount

        if (this.timeShieldCount >= this.timeShield) {
            this.undead = false
        }

        setInterval(() => {
            this.play_sound_hit = false
        }, 2000);
    }

    settimeUndead() {

        var intervalShield = setInterval(() => {

            if (this.timeShieldCount >= this.timeShield) {
                this.undead = false
                io.emit("time_out_shield", this.id, this.timeShieldCount)
                clearInterval(intervalShield)
            } else {
                if (((this.timeShieldCount * 100) / this.timeShield) >= 70) {
                    this.shieldAnimation.stop = false
                }
            }
            this.timeShieldCount += 1000
        }, 1000)

    }



    cambiarPersonaje(personaje) {
        this.personaje = personaje;
        delete (this.animaciones);
        this.imagenes = animationManager.imagenes[personaje];
        this.animaciones = new animation(this.imagenes, this.speedImage);
        this.shieldAnimation = new animation(animationManager.imagenes["shield"], 0.1)
    }
    Update() {
        if (this.dead == false) {
            this.shieldAnimation.Update(0, 3)
        }


        // down
        if (this.dir == dir.DOWN) {
            this.animaciones.Update(0, 5);
        }
        // up
        else if (this.dir == dir.UP) {
            this.animaciones.Update(18, 23);
        }
        // left
        else if (this.dir == dir.LEFT) {
            this.animaciones.Update(12, 17);
        }
        // right
        else if (this.dir == dir.RIGHT) {
            this.animaciones.Update(6, 11);
        } else if (this.animaciones != null) {
            this.animaciones.Update(0, 0);
        }
        if (this.dirAnterior != this.dir) {
            this.animaciones.index++;
            this.animaciones.frames = this.animaciones.index;
        }
        this.dirAnterior = this.dir;
    }
    Draw(ctx) {
        if (this.user != "") {
            if (camera.x - 32 < this.x && camera.x + camera.w > this.x &&
                camera.y - 32 < this.y && camera.y + camera.h > this.y) {
                if (this.animaciones.img[0] != null) {
                    ctx.fillStyle = "white";
                    ctx.font = "30px";
                    let text = "" + this.user;
                    let width = ctx.measureText(text).width;
                    ctx.fillStyle = 'rgba(0,0,0,0.6)';
                    ctx.fillRect((this.x - ((width / 2))) + (32 / 2), this.y - 25, width + 10, 21);
                    if (playerManager.id == this.id) {
                        ctx.fillStyle = '#3aafff';
                    }
                    else {
                        ctx.fillStyle = '#FFFFFF';
                    }
                    ctx.fillText(text, (this.x - ((width / 2))) + (32 / 2) + 5, this.y - 8);
                    this.animaciones.Draw(ctx, this.x + 2.5, this.y, 500, 500, "player");
                    if (this.undead == true && this.dead == false) {
                        this.shieldAnimation.Draw(ctx, this.x, this.y, 500, 500, "shield");
                    }

                    if (debug.hit) this.hitbox.Draw(ctx);
                } else {
                    console.log("Error, no se ha cargado las imagenes al objeto: ");
                    console.log(this);
                }
            }
        }
    }
    cambiarPos(x, y) {
        this.hitbox.x = x;
        this.hitbox.y = y;
        this.x = x - this.posHitX;
        this.y = y - this.posHitY;
    }
    mov(velX, velY) {
        this.x += velX;
        this.y += velY;
        this.hitbox.x = this.x + this.posHitX;
        this.hitbox.y = this.y + this.posHitY;
    }
    igualar(data) {
        this.dead = data.dead;
        this.animaciones.stop = data.animaciones.stop;
        this.x = data.x;
        this.y = data.y;
        this.hitbox.x = data.x + data.posHitX;
        this.hitbox.y = data.y + data.posHitY;
        this.dir = data.dir;
        this.vel = data.vel;
        this.personaje = data.personaje;
        this.numBomb = data.numBomb;
        this.numMaxBomb = data.numMaxBomb;
        this.timeBomb = data.timeBomb;
        this.largeBomb = data.largeBomb;
    }
}