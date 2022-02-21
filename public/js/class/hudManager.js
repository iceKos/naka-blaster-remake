var hudManager = {
    lifes: 0,
    kills: 0,
    solid: false,
    leaderboard: [],
    killFeed: [],
    textKillFeed: [],
    time_over: false,
    isFinalRound: false,
    count_down: 99,
    round: 0,
    buttons: [],
};
var play_sound_alert_status = true



function isIntersect(pos, btn) {
    if (
        (pos.x >= btn.x && pos.x < btn.x + btn.width) &&
        (pos.y >= btn.y && pos.y < btn.y + btn.height)
    )
        return true;
    return false;
}

function renderTime(seconds) {
    var date = new Date(seconds * 1000).toISOString().substr(11, 8);
    var [hh, mm, ss] = date.split(":");
    if (hh != "00") {
        return `${hh}:${mm}:${ss}`;
    }

    if (mm != "00") {
        return `${mm}:${ss}`;
    } else {
        return ss;
    }
}

hudManager.genWord = function (length) {
    var text = "";
    for (var i = 0; i < length; i++) {
        text += "0"
    }
    return text
}

hudManager.LoadContent = function () {
    this.buttons = [
        {
            x: 260,
            y: 40,
            src: animationManager.imagenes["icon_mute"][0],
            width: 50,
            height: 50,
            color: 'rgb(255,0,0)',
            text: 'Button 1',
            callback: function () {
                soundSetting = !soundSetting

                if (soundSetting == 1) {
                    if (!music.overworld.playing()) {
                        music.overworld.play();
                    } else {
                        music.overworld.pause();
                    }
                } else {
                    music.overworld.pause();
                }
            },
            load: function () {
                if (soundSetting == 1) {
                    this.src = animationManager.imagenes["icon_mute"][0]
                } else {
                    this.src = animationManager.imagenes["icon_mute"][1]
                }
            }
        }, {
            x: 330,
            y: 40,
            src: animationManager.imagenes["record_screen"][0],
            width: 125,
            height: 50,
            color: 'rgb(255,0,0)',
            text: 'Button 1',
            callback: function () {
                handleScreenRecord()
            },
            load: function () {
                if (record_status == true) {
                    this.src = animationManager.imagenes["record_screen"][1]
                } else {
                    this.src = animationManager.imagenes["record_screen"][0]
                }
            }
        }
    ]
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
    let time_ui = animationManager.imagenes["time_ui"][0]

    // ===================== killFeed =================
    for (let i = 0; i < hudManager.killFeed.length; i++) {
        if (hudManager.killFeed[i]) { // check not null
            // check kill themself or not
            if (hudManager.killFeed[i].p1.id == hudManager.killFeed[i].p2.id) {
                hudManager.textKillFeed.push(hudManager.killFeed[i].p1.user + " Kill themself.");
            } else {
                hudManager.textKillFeed.push(hudManager.killFeed[i].p1.user + " Kill " + hudManager.killFeed[i].p2.user);
            }

            setTimeout(function () {
                if (hudManager.textKillFeed.length > 0) {
                    hudManager.textKillFeed.shift();
                }
            }, 5000 + i * 1000);
        }
    }

    // clear kill feed
    hudManager.killFeed = [];
    // render kill feed
    for (let i = 0; i < hudManager.textKillFeed.length; i++) {
        let widthText2 = ctx.measureText(hudManager.textKillFeed[i]).width;
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        roundRect(
            ctx,
            canvas.width / 2 - (widthText2 / 2 + 50),
            150 + i * 50,
            widthText2 + 60,
            35,
            3,
            true
        );
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(
            hudManager.textKillFeed[i],
            canvas.width / 2 - widthText2 / 2,
            175 + i * 50
        );
        ctx.drawImage(
            animationManager.imagenes["bomb"][0],
            canvas.width / 2 - (widthText2 / 2 + 40),
            150 + i * 50,
            30,
            30
        );
    }
    // ===================== killFeed =================

    // =================== lifes UI =====================
    if (hudManager.lifes >= 0) {
        for (let i = hudManager.lifes; i > 0; i--) {
            ctx.drawImage(animationManager.imagenes["heart"][0], canvas.width - i * 20 - 32, 10);
        }
    }
    // =================== lifes UI =====================

    //=================== Kill UI ===================
    let text = "Kills: " + hudManager.kills;
    let width = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(canvas.width - (width + 45 + hudManager.lifes * 20), 10, width + 10, 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, canvas.width - (width + 40 + hudManager.lifes * 20), 33);
    //=================== Kill UI ===================

    // ================== Leaderboard UI TOP 5 PLAYER ===================
    var panel_startX = 5
    var panel_starty = 5
    var panel_width = 240
    var panel_height = 300
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.font = "20px BADABB";
    ctx.globalAlpha = 0.8;
    ctx.drawImage(imgInterface[1], 0, 0, 590, 635, panel_startX, panel_starty, panel_width, panel_height);
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    ctx.fillText(" TOP PLAYER ", panel_startX + (panel_width / 2), 32);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(" TOP PLAYER ", panel_startX + (panel_width / 2), 31);
    ctx.font = "25px BADABB";
    ctx.textAlign = "start";

    for (let i = 0; i < this.leaderboard.length; i++) {
        try {
            let player =
                this.leaderboard[i].user.length > 9
                    ? this.leaderboard[i].user.substr(0, 7) + "..."
                    : this.leaderboard[i].user;

            if (playerManager.id == this.leaderboard[i].id) {
                ctx.fillStyle = "rgb(255 234 111)";
            } else {
                ctx.fillStyle = "#FFFFFF";
            }
            ctx.fillText(
                `${i + 1}. ${player}`,
                20,
                70 + 50 * i
            );
            ctx.textAlign = "end";
            ctx.fillText(`${this.leaderboard[i].kills} Kills `, panel_width - 5,
                70 + 50 * i)
            ctx.textAlign = "start";
        } catch (error) { }
    }
    ctx.font = "20px BADABB";
    // ================== Leaderboard UI TOP 5 PLAYER ===================

    // ======================== Buff UI ===========================
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
    // ======================== Buff UI ===========================

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
    };
    // ============================ render other player state ================================


    //============================= TIME UI =======================================
    var width_canvas_center = canvas.width / 2
    var widthTop = 230;
    var startY = 15
    var heightPanelTime = 100

    ctx.drawImage(
        time_ui,
        0,
        0,
        widthTop,
        heightPanelTime,
        (width_canvas_center - (widthTop / 2)),
        startY,
        widthTop,
        heightPanelTime
    );

    if (hudManager.time_over != true) {

        if (this.count_down <= 10) {

            if (soundSetting == 0) {
                music.sound_alert.pause()
                play_sound_alert_status = true
            }

            if (play_sound_alert_status && soundSetting == 1) {
                music.sound_alert.play()
                play_sound_alert_status = false
            }

            if (this.count_down % 2 == 0) {
                ctx.fillStyle = "rgba(245, 0, 0, 0.3)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "rgba(245, 0, 0, 1)";
            } else {
                ctx.fillStyle = "#FFFFFF";
            }
        } else {
            music.sound_alert.pause()
        }


        ctx.font = `2em BADABB`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`Round ${this.round}`, canvas.width / 2, 50);
        ctx.fillText(`${renderTime(this.count_down)}`, canvas.width / 2, 85);
    } else {
        ctx.font = `2em BADABB`;
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`TIME OVER`, canvas.width / 2, ((heightPanelTime / 2) + 15));

        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";
    }
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    ctx.font = "20px BADABB";
    //============================= TIME UI =======================================

    //============================= UI BUTTON =================================
    this.buttons.forEach(b => {
        ctx.drawImage(
            b.src,
            0,
            0,
            b.width,
            b.height,
            b.x,
            b.y,
            b.width,
            b.height
        );
        b.load()
    });
    //============================= UI BUTTON =================================

}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius.br,
        y + height
    );
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }


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
io.on("killfeed", (player1, player2) => {
    hudManager.killFeed.push({
        p1: { id: player1.id, user: player1.user },
        p2: { id: player2.id, user: player2.user },
    });
})
io.on("COUNTDOWN", ({ round, sec, isFinalRound }) => {
    if (hudManager.round != round) {

        play_sound_alert_status = true
    }
    hudManager.count_down = sec;
    hudManager.round = round;
    hudManager.isFinalRound = isFinalRound;
});
io.on("TIME_OVER", ({ message }) => {
    hudManager.time_over = true;
    music.sound_alert.pause()
});