var powerManager = {
    powers: [],
    deletePowerIndex: [],
    pos_powers: [],
    type: {
        power: 1,
        bomb: 2,
        speed: 3
    }
};

powerManager.LoadContent = function () { };

powerManager.Draw = function (ctx) {
    let imgPower = animationManager.imagenes['poder'];
    this.powers.forEach(power => {
        // se imprime cada uno en pantalla
        if (camera.x - 32 < power.x && camera.x + camera.w > power.x &&
            camera.y - 32 < power.y && camera.y + camera.h > power.y) {
            switch (power.type) {
                case this.type.power:
                    ctx.drawImage(imgPower[power.type], power.x, power.y);
                    break;
                case this.type.bomb:
                    ctx.drawImage(imgPower[power.type], power.x, power.y);
                    break;
                case this.type.speed:
                    ctx.drawImage(imgPower[power.type], power.x, power.y);
                    break;
            }
            if (debug.hit) power.Draw(ctx);
        }
    });
};

powerManager.Update = function () {
    let player = playerManager.personajes[playerManager.id];
    powerManager.recheckDeletePower();
    if (player) {
        this.powers.forEach((power, index) => {
            if (player.hitbox.chocarCon(power)) {
                if (power.type != null) {
                    if (player.power) {
                        player.power.push(power.type);
                    } else {
                        player.power = [];
                        player.power.push(power.type);
                    }
                    powerManager.setPower(index, player.id);
                    delete this.powers[index];
                    io.emit('eliminatePower', index, player);
                    this.pos_powers[index] = -1;
                }
            }
        });
    }
};
powerManager.generatePower = function (x, y, type, index) {
    if (type != -1) {
        this.powers[index] = new rectangulo(x, y, 32, 32);
        this.powers[index].type = type;
    }
};
powerManager.dropPower = function (id) {
    player = playerManager.personajes[id];
    if (player) {
        if (player.power) {
            let x, y;
            x = Math.floor(player.hitbox.x / 32) * 32;
            y = Math.floor(player.hitbox.y / 32) * 32;
        }
    }
}

io.on('generatePosPower', data => {
    console.log("generatePosPower coming");
    powerManager.pos_powers[data.id] = data.type;
});
io.on('powers', data => {
    powerManager.pos_powers = data;
    powerManager.pos_powers.forEach((types, index) => {

        if (index == null || powerManager.pos_powers[index] == null) {
            delete powerManager.pos_powers[index];
        }
    });
    powerManager.pos_powers.forEach((types, index) => {
        let posX = 0;
        let posY = 0;
        for (let i = 0; i < index; i++) {
            posX += 32;
            if ((i + 1) % blockManager.widthmap == 0) {
                posY += 32;
                posX = 0;
            }
        }
        powerManager.generatePower(posX, posY, types, index);
    });
    screenManager.check.power = true;
});

powerManager.recheckDeletePower = () => {

    powerManager.deletePowerIndex.forEach(indexPower => {
        if (powerManager.powers[indexPower]) {
            delete powerManager.powers[indexPower];
        }
    })
}

powerManager.setPower = (indexPower, playerId) => {
    let player = playerManager.personajes[playerId];
    if (powerManager.powers[indexPower]) {
        switch (powerManager.powers[indexPower].type) {
            case powerManager.type.power:
                if (playerManager.id == playerId) {
                    if (playerManager.buffLevel.power.value < playerManager.buffLevel.power.max) {
                        playerManager.buffLevel.power.value += 1
                    }

                }
                player.largeBomb += 1;

                break;
            case powerManager.type.bomb:
                if (playerManager.id == playerId) {
                    if (playerManager.buffLevel.bombs.value < playerManager.buffLevel.bombs.max) {
                        playerManager.buffLevel.bombs.value += 1
                    }
                }
                player.numMaxBomb += 1;
                player.numBomb += 1;

                break;
            case powerManager.type.speed:
                if (playerManager.id == playerId) {
                    if (playerManager.buffLevel.speed.value < playerManager.buffLevel.speed.max) {
                        playerManager.buffLevel.speed.value += 1
                    }
                }
                player.vel += 0.5;
                break;
        }

        playerManager.personajes[playerId] = player

        // TODO: Play sound level up here
        if (playerManager.id == playerId) {
            soundLevelUp.play()
        }
    }

};

//upgrade Power
io.on('actualizarPower', function (data, index) {
    setTimeout(() => {
        let player = playerManager.personajes[data.id];
        if (player) {
            powerManager.setPower(index, player.id);
        }

        powerManager.deletePowerIndex.push(index);
        delete powerManager.powers[index];
    }, 500);
});