var hudManager = {
    lifes: 0,
    kills: 0,
    solid: false,
    leaderboard: []
};


hudManager.genWord = function (length) {
    var text = "";
    for (var i = 0; i < length; i++) {
        text += "0"
    }
    return text
}

hudManager.Update = function () {

};
hudManager.Draw = function (ctx) {
    ctx.font = "20px BADABB";
    let imgPower = animationManager.imagenes["poder"];
    let imgInterface = animationManager.imagenes["interface"];
    let powerImage = imgPower[1];
    let bombImage = imgPower[2];
    let speedImage = imgPower[3];
    // =================== lifes UI =====================
    if (hudManager.lifes >= 0) {
        for (let i = hudManager.lifes; i > 0; i--) {
            ctx.drawImage(animationManager.imagenes["heart"][0], canvas.width - i * 20 - 32, 10);
        }
    }

    //=================== Kill UI ===================
    let text = "Kills: " + hudManager.kills;
    let width = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(canvas.width - (width + 45 + hudManager.lifes * 20), 10, width + 10, 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, canvas.width - (width + 40 + hudManager.lifes * 20), 33);

    // =================== Leaderboard UI ===================

    // have to check max of user name
    var list_user_length = Math.max(...this.leaderboard.map(x => String(x.user).length))
    let widthBoxLeaderborad = ctx.measureText(hudManager.genWord(list_user_length)).width;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, widthBoxLeaderborad + 50, (40 * this.leaderboard.length) + 60);
    for (let i = 0; i < this.leaderboard.length; i++) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText((i + 1) + '. ' + this.leaderboard[i].user + '[' + this.leaderboard[i].kills + ']', 20, (55 + 30 * i) + 10);


    }

    // ======================== Buff ===========================

    let buffEffect = [
        {
            label: "Power    LV", properties: "power", y: 122,
            image: {
                src: powerImage,
                x: canvas.width - 1 * 20 - 175,
                y: 95
            }
        },
        {
            label: "Speed     LV", properties: "speed", y: 175,
            image: {
                src: speedImage,
                x: canvas.width - 1 * 20 - 175,
                y: 150
            }
        },
        {
            label: "Bombs    LV", properties: "bombs", y: 230,
            image: {
                src: bombImage,
                x: canvas.width - 1 * 20 - 175,
                y: 205
            }
        },
    ];
    buffEffect.forEach((buff, index) => {
        const text = `${buff.label}`
        const widthText = ctx.measureText(text).width;

        if (index == 0) {
            ctx.globalAlpha = 0.8;
            ctx.drawImage(
                imgInterface[1],
                0,
                0,
                590,
                500,
                canvas.width - (widthText + 130),
                50,
                widthText + 120,
                200
            );
            ctx.globalAlpha = 1;
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillText(" Skill ", canvas.width - (widthText + 50), 77);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(" Skill ", canvas.width - (widthText + 50), 75);
        }

        const x = canvas.width - (widthText + 20) - 50;

        // have it shadow
        // render label
        ctx.textAlign = "start";
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillText(text, x, buff.y + 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(text, x, buff.y);

        // render value
        ctx.textAlign = "center";
        if (playerManager.buffLevel[buff.properties].value >= playerManager.buffLevel[buff.properties].max) {
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText("MAX", canvas.width - 45, buff.y + 2);
            ctx.fillStyle = "red";
            ctx.fillText("MAX", canvas.width - 45, buff.y);
        } else {
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText(playerManager.buffLevel[buff.properties].value, canvas.width - 45, buff.y + 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(playerManager.buffLevel[buff.properties].value, canvas.width - 45, buff.y);
        }

        ctx.textAlign = "start";

        // draw image
        ctx.drawImage(
            buff.image.src,
            0,
            0,
            32,
            32,
            buff.image.x,
            buff.image.y,
            40,
            40
        );
    })

    // ============================ render debug state ================================
    var my_player = playerManager.personajes[playerManager.id];
    if (my_player) {
        if (debug.info == true) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(`ID : ${my_player.id}`, 5, canvas.height - 450);
            ctx.fillText(`x : ${my_player.hitbox.x}`, 5, canvas.height - 400);
            ctx.fillText(`y : ${my_player.hitbox.y}`, 5, canvas.height - 350);
            ctx.fillText(`dead : ${my_player.dead}`, 5, canvas.height - 300);
            ctx.fillText(`speed : ${my_player.vel}`, 5, canvas.height - 250);
            ctx.fillText(`Num Bomb : ${my_player.numBomb}`, 5, canvas.height - 200);
            ctx.fillText(
                `Num Max Bomb : ${my_player.numMaxBomb}`,
                5,
                canvas.height - 150
            );
            ctx.fillText(`timeBomb : ${my_player.timeBomb}`, 5, canvas.height - 100);
            ctx.fillText(`largeBomb : ${my_player.largeBomb}`, 5, canvas.height - 50);
            ctx.fillText(`speedImage : ${my_player.speedImage}`, 5, canvas.height - 5);
        }

    }

    // ============================ render debug state ================================

    // ============================ render other player state ================================
    if (debug.info == true) {
        var start_debug_y = 300;
        // ctx.textAlign = "end"
        for (var i = 0; i < playerManager.personajes.length; i++) {
            if (playerManager.personajes[i]) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(
                    `ID : ${playerManager.personajes[i].id} , dead : ${playerManager.personajes[i].dead}`,
                    canvas.width - 150,
                    start_debug_y
                );
                start_debug_y += 50;
            }
        }
        // ============================ render other player state ================================

    };
}




io.on('kill', kill => {
    hudManager.kills = kill;
});

io.on('lifes', data => {
    hudManager.lifes = data;
});
io.on('leaderboard', data => {
    hudManager.leaderboard = data;
});