var bombManager = {
    bombs: [],
    explosions: [],
    typeExplo: [],
    puesta: false,
    space_bar: false,
    type: {
        CENTER: 0,
        TOPMID: 1,
        TOP: 2,
        BOTMID: 3,
        BOT: 4,
        RIGHTMID: 5,
        RIGHT: 6,
        LEFT: 7,
        LEFTMID: 8
    },
    animationExplo: []
};
bombManager.Draw = function (ctx) {
    this.bombs.forEach(element => {
        element.Draw(ctx);
    });
    this.explosions.forEach((element, index) => {

        if (debug.hit) {
            element.Draw(ctx);
        }
        this.UpdateDrawExploAnimation(ctx, index);
    });
};
bombManager.UpdateDrawExploAnimation = function (ctx, index) {
    switch (this.typeExplo[index]) {
        case this.type.CENTER:
            bombManager.animationExplo[index].Update(0, 3);
            break;
        case this.type.TOPMID:
            bombManager.animationExplo[index].Update(24, 27);
            break;
        case this.type.BOTMID:
            bombManager.animationExplo[index].Update(24, 27);
            break;
        case this.type.LEFTMID:
            bombManager.animationExplo[index].Update(20, 23);
            break;
        case this.type.RIGHTMID:
            bombManager.animationExplo[index].Update(20, 23);
            break;
        case this.type.RIGHT:
            bombManager.animationExplo[index].Update(4, 7);
            break;
        case this.type.LEFT:
            bombManager.animationExplo[index].Update(12, 15);
            break;
        case this.type.TOP:
            bombManager.animationExplo[index].Update(8, 11);
            break;
        case this.type.BOT:
            bombManager.animationExplo[index].Update(16, 19);
            break;
    }
    if (bombManager.animationExplo[index]) {
        bombManager.animationExplo[index].Draw(ctx, bombManager.explosions[index].x, bombManager.explosions[index].y);
    }
    if (bombManager.animationExplo[index]) {
        if (bombManager.animationExplo[index].countReset > 1) {
            bombManager.animationExplo[index].stop = true;
        }
    }
}


bombManager.Update = function () {
    this.bombs.forEach(element => {
        element.Update();
    });

    // TODO: change loop object [DONE]
    Object.values(playerManager.personajes).forEach((player, index) => {
        bombManager.explosions.forEach(explo => {

            if (player.hitbox.chocarCon(explo) && !player.dead) {

                if (player.undead == false) {

                    if (explo.colocaid == playerManager.id && explo.colocaid != player.id) {
                        console.log("aumentarKill", 85, "player.dead", player.dead);
                        io.emit('aumentarKill', playerManager.id, player.id);
                        io.emit("killfeed", playerManager.id, player.id)
                        console.log("killfeed", 88, "player.dead", player.dead);
                    }

                    if (explo.colocaid == playerManager.id && player.id == explo.colocaid) {
                        io.emit("killfeed", playerManager.id, player.id)
                        console.log("killfeed", 93, "player.dead", player.dead);
                    }
                    player.dead = true;
                    io.emit("dead", player.id);
                } else {
                    if (player.play_sound_hit == false && player.id == playerManager.id) {
                        player.play_sound_hit = true
                        if (soundSetting == 1) {
                            music.shieldHit.play();
                        }

                    }

                }


            }

        });
    });
    if (keys[32] && playerManager.personajes[playerManager.id] != null) {

        let tocar = bombManager.SobreBomb(playerManager.personajes[playerManager.id].hitbox);
        if (!tocar && !this.puesta && playerManager.personajes[playerManager.id].numBomb > 0 && playerManager.personajes[playerManager.id].dead == false && this.space_bar == false) {
            playerManager.personajes[playerManager.id].numBomb -= 1;
            this.puesta = true;
            this.space_bar = true
            let x, y;
            x = (Math.floor((playerManager.personajes[playerManager.id].hitbox.x / 32) + 0.4) * 32);
            y = (Math.floor((playerManager.personajes[playerManager.id].hitbox.y / 32) + 0.35) * 32);
            io.emit('newBomb', { x: x, y: y });
            // TODO: have to play sound drop bomb
            if (soundSetting == 1) {
                music.place.play();
            }

        }
    } else {
        this.space_bar = false
    }
};
bombManager.colocarBomba = function (data) {
    var player = playerManager.personajes[data.id];
    var bomba = new bomb(data.x, data.y, player.timeBomb, player.largeBomb, data.bombId);
    if (playerManager.personajes[playerManager.id] != null) {
        if (player.id != playerManager.id) bomba.recienColocada = false;
    }
    bomba.coloca = player;
    this.bombs.push(bomba);
    bomba.tmp = setTimeout(this.temporizador, player.timeBomb, bomba, player);
}

bombManager.temporizador = function (bomba, coloca) {
    if (bombManager.bombs.indexOf(bomba) != -1) {
        // TODO: Play sound bomb music.explode.
        if (soundSetting == 1) {
            music.explode.play();
        }

        delete bombManager.bombs[bombManager.bombs.indexOf(bomba)];
        // explosión del centro
        var bX = bomba.x, bY = bomba.y, bAncho = bomba.hitbox.ancho, bAlto = bomba.hitbox.alto;
        var Texplo = 550; // tiempo que dura las explosiones
        var explo = new rectangulo(bX, bY, bAncho, bAlto); // se crea una explosión
        explo.colocaid = coloca.id;
        var index;
        var velocityAnimation = 0.14;
        index = bombManager.explosions.push(explo) - 1;
        bombManager.typeExplo[index] = bombManager.type.CENTER;
        bombManager.animationExplo[index] = new animation(animationManager.imagenes['explo'], velocityAnimation);
        bombManager.animationExplo[index].stop = false;
        setTimeout(bombManager.tiempoExplo, Texplo, explo);
        var tpm;
        let angulo = 0, cos, sin;
        for (var i = 0; i < 4; i++) {
            n = 1;
            angulo = Math.PI * (i / 2);
            cos = Math.round(Math.cos(angulo));
            sin = Math.round(Math.sin(angulo));
            do {
                explo = new rectangulo(bX + bAlto * n * cos, bY + bAlto * n * sin, bAncho, bAlto);
                explo.colocaid = coloca.id;
                tpm = bombManager.tocarBomb(explo);
                if (tpm.toco && tpm.bomba) {
                    clearTimeout(tpm.bomba.tmp);
                    bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                    break;
                } else if (tpm.toco) {
                    break;
                } else {
                    index = bombManager.explosions.push(explo) - 1;
                    if (coloca.largeBomb == n) {
                        if (cos == 1 && sin == 0)
                            bombManager.typeExplo[index] = bombManager.type.RIGHT;
                        if (cos == 0 && sin == -1)
                            bombManager.typeExplo[index] = bombManager.type.TOP;
                        if (cos == -1 && sin == 0)
                            bombManager.typeExplo[index] = bombManager.type.LEFT;
                        if (cos == 0 && sin == 1)
                            bombManager.typeExplo[index] = bombManager.type.BOT;
                    } else {
                        if (cos == 1 && sin == 0)
                            bombManager.typeExplo[index] = bombManager.type.RIGHTMID;
                        if (cos == 0 && sin == -1)
                            bombManager.typeExplo[index] = bombManager.type.TOPMID;
                        if (cos == -1 && sin == 0)
                            bombManager.typeExplo[index] = bombManager.type.LEFTMID;
                        if (cos == 0 && sin == 1)
                            bombManager.typeExplo[index] = bombManager.type.BOTMID;
                    }
                    bombManager.animationExplo[index] = new animation(animationManager.imagenes['explo'], velocityAnimation);
                    bombManager.animationExplo[index].stop = false;
                    setTimeout(bombManager.tiempoExplo, Texplo, explo);
                }
                n++;
            } while (n < coloca.largeBomb + 1);
        }
        if (playerManager.personajes[playerManager.id])
            if (playerManager.personajes[playerManager.id].numBomb <= playerManager.personajes[playerManager.id].numMaxBomb)
                if (coloca.id == playerManager.id) {
                    io.emit("sumBomb");
                    playerManager.personajes[playerManager.id].numBomb += 1;
                }
    }
};
bombManager.tocarBomb = function (hit) {
    var retornar = { toco: false, bomba: null };
    var encontro = true;
    // bomb
    var llaves = Object.keys(bombManager.bombs);
    var element;
    for (let i = 0; i < llaves.length; i++) {
        element = bombManager.bombs[llaves[i]];
        if (element.hitbox.chocarCon(hit)) {
            retornar.toco = true;
            retornar.bomba = element;
            break;
        }
    }
    if (!retornar.toco) {
        llaves = Object.keys(this.explosions);
        for (let i = 0; i < llaves.length; i++) {
            element = this.explosions[llaves[i]];
            if (element.chocarCon(hit)) {
                retornar.toco = true;
                break;
            };
        }
    }
    if (!retornar.toco) {
        llaves = Object.keys(blockManager.blocks);
        for (let i = 0; i < llaves.length; i++) {
            element = blockManager.blocks[llaves[i]];
            if (hit.chocarCon(element) && encontro) {
                retornar.toco = true;
                let index = llaves[i];
                io.emit('destroyBlock', index);
                blockManager.blocks[index].dead = true;
                blockManager.animationBlocks[index].stop = false;
                encontro = false;
                break;
            }
        }
    }
    if (!retornar.toco) {
        llaves = Object.keys(blockManager.walls);
        for (let i = 0; i < llaves.length; i++) {
            element = blockManager.walls[llaves[i]];
            if (hit.chocarCon(element)) {
                retornar.toco = true;
                break;
            }
        }
    }

    return retornar;
};
bombManager.SobreBomb = function (hit) {
    var retornar = false;
    var llaves = Object.keys(bombManager.bombs);
    var element;
    for (let i = 0; i < llaves.length; i++) {
        element = bombManager.bombs[llaves[i]];
        if (hit.chocarCon(element.hitbox)) {
            retornar = true;
            break;
        };
    }
    if (!retornar) {
        llaves = Object.keys(blockManager.blocks);
        for (let i = 0; i < llaves.length; i++) {
            element = blockManager.blocks[llaves[i]];
            if (element.chocarCon(hit)) {
                retornar = true;
                break;
            }
        }
    }
    return retornar;
}

bombManager.tiempoExplo = function (explo) {

    let index = bombManager.explosions.indexOf(explo);
    if (index != -1) {
        delete bombManager.typeExplo[index];
        delete bombManager.explosions[index];
    }
}

io.on('newBomb', function (data) {
    if (data.id == playerManager.id) bombManager.puesta = false;
    bombManager.colocarBomba(data);
});

io.on("kickBomb", function ({ currentPosition, nextPosition, direction, bombId }) {


    bombManager.bombs = bombManager.bombs.filter(x => x != null)
    var findIndexBomById = bombManager.bombs.findIndex(bomb => {
        return bomb.id == bombId
    })

    if (findIndexBomById >= 0) {
        if (soundSetting == 1) {
            music.soundKickBomb.play()
        }

        var bomb = bombManager.bombs[findIndexBomById]
        bomb.kick_status = true
        bomb.move_when_kick = true
        bomb.nextPosition = {
            x: nextPosition.x,
            y: nextPosition.y
        }
        bomb.kick_direction = direction
        bomb.kick_status = true
        bombManager.bombs[findIndexBomById] = bomb
    }


})