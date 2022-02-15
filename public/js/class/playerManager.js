var playerManager = {
    personajes: [],
    pj: [],
    id: 0,
    emitStop: true,
    pack: null,
    status_kick: false,
    buffLevel: {
        power: {
            value: 0,
            max: 10
        },
        bombs: {
            value: 0,
            max: 10
        },
        speed: {
            value: 0,
            max: 6
        },

    }
};
playerManager.Draw = function (ctx) {
    this.personajes.forEach(element => {
        this.personajes[element.id].Draw(ctx);
    });
    camera.Draw(ctx);
}
playerManager.Update = function () {
    this.mover();
    camera.Update();
    this.personajes.forEach(element => {
        if (camera.player == null) {
            camera.follow(this.personajes[element.id]);
        }
        this.personajes[element.id].Update();
    });
}

// Kick bomb Function
playerManager.kickBomb = function (bomb, lastHitbox) {
    var bombPosition = {
        x: Math.floor(bomb.hitbox.x / 32),
        y: Math.floor(bomb.hitbox.y / 32),
    };

    var lastHitboxPosition = {
        x: Math.floor(lastHitbox.x / 32),
        y: Math.floor(lastHitbox.y / 32),
    };

    // clear kick status can kick again
    setTimeout(() => {
        this.status_kick = false;
    }, 500);

    if (lastHitboxPosition.y == bombPosition.y) {
        if (lastHitboxPosition.x < bombPosition.x) {
            // kick left to right
            io.emit("kickBomb", {
                currentPosition: {
                    x: bombPosition.x * 32,
                    y: bombPosition.y * 32,
                },
                nextPosition: {
                    x: (bombPosition.x + 1) * 32,
                    y: bombPosition.y * 32,
                },
                direction: "LEFT_TO_RIGHT",
                bombId: bomb.id
            });
        }
        if (lastHitboxPosition.x > bombPosition.x) {
            // kick right to left
            io.emit("kickBomb", {
                currentPosition: {
                    x: bombPosition.x * 32,
                    y: bombPosition.y * 32,
                },
                nextPosition: {
                    x: (bombPosition.x - 1) * 32,
                    y: bombPosition.y * 32,
                },
                direction: "RIGHT_TO_LEFT",
                bombId: bomb.id
            });
        }
    }

    if (lastHitboxPosition.x == bombPosition.x) {
        if (lastHitboxPosition.y < bombPosition.y) {
            // kick top to bottom
            io.emit("kickBomb", {
                currentPosition: {
                    x: bombPosition.x * 32,
                    y: bombPosition.y * 32,
                },
                nextPosition: {
                    x: bombPosition.x * 32,
                    y: (bombPosition.y + 1) * 32,
                },
                direction: "TOP_TO_BOTTOM",
                bombId: bomb.id
            });
        }
        if (lastHitboxPosition.y > bombPosition.y) {
            // kick bottom to top
            io.emit("kickBomb", {
                currentPosition: {
                    x: bombPosition.x * 32,
                    y: bombPosition.y * 32,
                },
                nextPosition: {
                    x: bombPosition.x * 32,
                    y: (bombPosition.y - 1) * 32,
                },
                direction: "BOTTOM_TO_TOP",
                bombId: bomb.id
            });
        }
    }

}

// check object solid
playerManager.solido = function (x, y, player) {

    let esSolido = false, temporal;
    var fix = false;
    temporal = player.hitbox.copy();
    var lastHitbox = { x: temporal.x, y: temporal.y };
    temporal.x += x;
    temporal.y += y;
    let llaves = Object.keys(bombManager.bombs);
    let element;
    // check move hit bomb or not
    for (let i = 0; i < llaves.length; i++) {
        element = bombManager.bombs[llaves[i]];
        if (!element.recienColocada) {
            esSolido = element.hitbox.chocarCon(temporal);
            if (esSolido) {
                // if bomb status kick == true can pass bomb 
                if (element.kick_status == true) {
                    esSolido = false
                    break;
                }
                if (this.status_kick == false && element.kick_status == false) {
                    element.kick_status = true
                    this.status_kick = true;
                    this.kickBomb(element, lastHitbox);
                }
                break;
            }


        }
        else if (!element.hitbox.chocarCon(temporal))
            element.recienColocada = false;
    }

    // check move to hit block or not


    if (!esSolido && !player.atra) {
        llaves = Object.keys(blockManager.blocks);
        for (let i = 0; i < llaves.length; i++) {
            element = blockManager.blocks[llaves[i]];

            if (element.chocarCon(temporal)) {
                esSolido = true;
                break;
            }
        }
    }

    // check hit rock or not
    if (!esSolido) {
        llaves = Object.keys(blockManager.paredes);
        for (let i = 0; i < llaves.length; i++) {
            element = blockManager.paredes[llaves[i]];
            if (element.chocarCon(temporal)) {
                esSolido = true;
                break;
            }
        }
    }


    if (esSolido) {
        esSolido = playerManager.fixCorner(x, y, player.atra);
        fix = true;
    }
    return { f: fix, s: esSolido };
};
playerManager.fixCorner = function (dirX, dirY, atra) {
    let x = Math.round(this.personajes[this.id].hitbox.x / 32);
    let y = Math.round(this.personajes[this.id].hitbox.y / 32);
    if (dirX != 0) dirX = dirX > 0 ? 1 : -1;
    if (dirY != 0) dirY = dirY > 0 ? 1 : -1;
    var edgeSize = 30;
    var pos = { x: x, y: y };
    var position;
    var pos1 = { x: x + dirY, y: y + dirX };
    var bmp1 = this.multi(pos1);
    var pos2 = { x: x - dirY, y: y - dirX };
    var bmp2 = this.multi(pos2);
    if (this.estaVacio((pos.x + dirX) * 32, (pos.y + dirY) * 32, atra)) {
        position = pos;
    }
    else if (this.estaVacio(bmp1.x, bmp1.y, atra) && this.estaVacio(bmp1.x + dirX * 32, bmp1.y + dirY * 32, atra)
        && Math.abs(this.personajes[this.id].hitbox.y - bmp1.y) < edgeSize
        && Math.abs(this.personajes[this.id].hitbox.x - bmp1.x) < edgeSize) {
        position = pos1;
    }
    else if (this.estaVacio(bmp2.x, bmp2.y, atra) && this.estaVacio(bmp2.x + dirX * 32, bmp2.y + dirY * 32, atra)
        && Math.abs(this.personajes[this.id].hitbox.y - bmp2.y) < edgeSize
        && Math.abs(this.personajes[this.id].hitbox.x - bmp2.x) < edgeSize) {
        position = pos2;
    }
    if (position != null) {
        position = this.multi(position);
        if (this.estaVacio(position.x, position.y, atra)) {
            var fixX = 0;
            var fixY = 0;
            if (dirX) {
                fixY = (position.y - this.personajes[this.id].hitbox.y) > 0 ? 1 : -1;
            } else {
                fixX = (position.x - this.personajes[this.id].hitbox.x) > 0 ? 1 : -1;
            }
            fixX = fixX * this.personajes[this.id].vel;
            fixY = fixY * this.personajes[this.id].vel;
            this.personajes[this.id].mov(fixX, fixY);
            return false;
        }
    }
    return true;
}
playerManager.estaVacio = function (x, y, atra) {
    var retorna = true;
    var caja = new rectangulo(x, y, 1, 1);
    let llaves = Object.keys(bombManager.bombs);
    let element;
    for (let i = 0; i < llaves.length; i++) {
        element = bombManager.bombs[llaves[i]];
        if (!element.recienColocada) {
            retorna = !element.hitbox.chocarCon(caja);
            break;
        }
    }
    bombManager.bombs.forEach(element => {
        if (!element.recienColocada) {
            retorna = !element.hitbox.chocarCon(caja);
        }
    });
    if (retorna && !atra) {
        llaves = Object.keys(blockManager.blocks);
        for (let i = 0; i < llaves.length; i++) {
            element = blockManager.blocks[llaves[i]];
            if (element.chocarCon(caja)) {
                retorna = false;
                break;
            }
        }
    }
    if (retorna) {
        llaves = Object.keys(blockManager.paredes);
        for (let i = 0; i < llaves.length; i++) {
            element = blockManager.paredes[llaves[i]];
            if (element.chocarCon(caja)) {
                retorna = false;
                break;
            }
        }
    }
    return retorna;
}
playerManager.multi = function (_) {
    return { x: _.x * 32, y: _.y * 32 }
}
playerManager.mover = function () {
    if (animationManager.imagenes != null && this.personajes[this.id] != null) {

        let solido;

        // MOVE RIFGT
        if ((keys[68] || keys[39]) && this.personajes[this.id].mov) {
            solido = playerManager.solido(this.personajes[this.id].vel, 0, this.personajes[this.id]);
            // solido = playerManager.solido(200, 0, this.personajes[this.id]);
            if (!solido.s) {
                this.personajes[this.id].dir = dir.DERECHA;
                this.personajes[this.id].animaciones.stop = false;

                if (!solido.f) this.personajes[this.id].mov(this.personajes[this.id].vel, 0);
                this.pack = {
                    x: this.personajes[this.id].x,
                    y: this.personajes[this.id].y,
                    animaciones: { stop: this.personajes[this.id].animaciones.stop },
                    dir: this.personajes[this.id].dir
                };
                io.emit('mover', this.pack);
                this.emitStop = true;
            }
        }

        // MOVE LEFT
        else if ((keys[65] || keys[37]) && this.personajes[this.id].mov) {

            solido = playerManager.solido(-this.personajes[this.id].vel, 0, this.personajes[this.id]);
            if (!solido.s) {
                this.personajes[this.id].dir = dir.IZQUIERDA;
                this.personajes[this.id].animaciones.stop = false;
                if (!solido.f) this.personajes[this.id].mov(-this.personajes[this.id].vel, 0);
                this.pack = {
                    x: this.personajes[this.id].x,
                    y: this.personajes[this.id].y,
                    animaciones: { stop: this.personajes[this.id].animaciones.stop },
                    dir: this.personajes[this.id].dir
                };
                io.emit('mover', this.pack);
                this.emitStop = true;
            }
        }
        // MOVE TOP
        else if ((keys[87] || keys[38]) && this.personajes[this.id].mov) {
            solido = playerManager.solido(0, -this.personajes[this.id].vel, this.personajes[this.id]);
            if (!solido.s) {
                this.personajes[this.id].dir = dir.ARRIBA;
                this.personajes[this.id].animaciones.stop = false;
                if (!solido.f) this.personajes[this.id].mov(0, -this.personajes[this.id].vel);
                this.pack = {
                    x: this.personajes[this.id].x,
                    y: this.personajes[this.id].y,
                    animaciones: { stop: this.personajes[this.id].animaciones.stop },
                    dir: this.personajes[this.id].dir
                };
                io.emit('mover', this.pack);
                this.emitStop = true;
            }
        }
        // MOVE BOTTOM
        else if ((keys[83] || keys[40]) && this.personajes[this.id].mov) {
            solido = playerManager.solido(0, this.personajes[this.id].vel, this.personajes[this.id]);
            if (!solido.s) {
                this.personajes[this.id].dir = dir.ABAJO;
                this.personajes[this.id].animaciones.stop = false;
                if (!solido.f) this.personajes[this.id].mov(0, this.personajes[this.id].vel);
                this.pack = {
                    x: this.personajes[this.id].x,
                    y: this.personajes[this.id].y,
                    animaciones: { stop: this.personajes[this.id].animaciones.stop },
                    dir: this.personajes[this.id].dir
                };
                io.emit('mover', this.pack);
                this.emitStop = true;
            }
        } else {

            // EVENT STOP MOVE
            this.personajes[this.id].animaciones.stop = true;
            if (this.emitStop) {

                this.pack = {
                    x: this.personajes[this.id].x,
                    y: this.personajes[this.id].y,
                    animaciones: { stop: this.personajes[this.id].animaciones.stop },
                    dir: this.personajes[this.id].dir
                };
                io.emit('mover', this.pack);
                this.emitStop = false;
            }
        }
    }
}

playerManager.copy = function (data) {

    let copy = new player(data.id, data.x, data.y, data.vel, data.personaje, data.posHitX, data.posHitY, data.anchoHit, data.altoHit, data.numBomb, data.timeBomb, data.largeBomb, data.timeShield, data.timeShieldCount);
    copy.user = data.user;
    return copy;
}

io.on('newID', function (data, user, pj) {
    playerManager.id = data;
    let c = playerManager.posicionRandom();
    playerManager.personajes[playerManager.id] = new player(playerManager.id, 30, -7, 2, pj, 5, 45, 25, 17, 1, 3000, 1, 10000, 0);
    playerManager.personajes[playerManager.id].user = user;
    playerManager.personajes[playerManager.id].cambiarPos(c.x, c.y);
    camera.follow(playerManager.personajes[playerManager.id]);
    io.emit("new_player", playerManager.personajes[playerManager.id]);
});
// por si entra otro jugador
io.on('new_player', function (data) {
    let copy = playerManager.copy(data);
    playerManager.personajes[data.id] = copy;
    if (data.id == playerManager.id) {
        //TODO: reset buff here
        playerManager.resetBuff()
        camera.follow(playerManager.personajes[data.id]);
    }
});

// recibe todos los jugadores en la sala
io.on('allplayers', function (data) {
    let copy;
    data.forEach(element => {
        console.log("allplayers", element);
        copy = playerManager.copy(element);
        playerManager.personajes[copy.id] = copy;
    });
});
// recibe quien se mueve
io.on('mover', function (data) {
    if (playerManager.personajes[data.id] != null) {
        playerManager.personajes[data.id].x = data.x;
        playerManager.personajes[data.id].y = data.y;
        playerManager.personajes[data.id].hitbox.x = data.x + playerManager.personajes[data.id].posHitX;
        playerManager.personajes[data.id].hitbox.y = data.y + playerManager.personajes[data.id].posHitY;
        playerManager.personajes[data.id].dead = data.dead;
        playerManager.personajes[data.id].animaciones.stop = data.animaciones.stop;
        playerManager.personajes[data.id].dir = data.dir;
        if (playerManager.personajes[data.id].dead)
            delete playerManager.personajes[data.id];
    }
});

io.on("time_out_shield", function (playerId, countTimeShield) {
    if (playerManager.personajes[playerId] != null) {
        playerManager.personajes[playerId].countTimeShield = countTimeShield
        playerManager.personajes[playerId].undead = false
    }
})

io.on('dead', function (playerId) {
    if (playerId == playerManager.id) {
        io.emit('delete');
    }
    playerManager.personajes[playerId].animaciones.countReset = 0;
    playerManager.personajes[playerId].animaciones.frames = 11;
    playerManager.personajes[playerId].Update = function () {
        playerManager.personajes[playerId].animaciones.stop = false;
        playerManager.personajes[playerId].animaciones.Update(24, 29);
        if (playerManager.personajes[playerId].animaciones.countReset == 1) {
            delete playerManager.personajes[playerId];
            if (camera.player.id == playerId) {
                delete camera.player;
            }
        }
    }
    playerManager.personajes[playerId].mov = null;
});
playerManager.posicionRandom = function () {
    var vectorX = [1, 19, 37, 9, 29, 1, 19, 37, 29, 1, 19, 37];
    var vectorY = [1, 1, 1, 7, 7, 15, 15, 15, 21, 27, 27, 27];
    var j = getRndInteger(0, vectorX.length - 1);
    var c = {
        x: vectorX[j] * 32,
        y: vectorY[j] * 32
    }
    return c;
}

playerManager.resetBuff = function () {
    this.buffLevel.power.value = 0;
    this.buffLevel.speed.value = 0;
    this.buffLevel.bombs.value = 0
}