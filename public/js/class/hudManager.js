var hudManager = {
    lifes: 0,
    kills: 0,
    leaderboard: []
};
hudManager.Update = function () {

};
hudManager.Draw = function (ctx) {
    if (hudManager.lifes >= 0) {
        for (let i = hudManager.lifes; i > 0; i--) {
            ctx.drawImage(animationManager.imagenes["heart"][0], canvas.width - i * 20 - 32, 10);
        }
    }
    let text = "Kills: " + hudManager.kills;
    let width = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(canvas.width - (width + 45 + hudManager.lifes * 20), 10, width + 10, 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, canvas.width - (width + 40 + hudManager.lifes * 20), 33);

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, 122, 180);
    for (let i = 0; i < this.leaderboard.length; i++) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText((i + 1) + '. ' + this.leaderboard[i].user + '[' + this.leaderboard[i].kills + ']', 20, 50 + 25 * i);
    }


    // ============================ render debug state ================================
    var my_player = playerManager.personajes[playerManager.id];
    if (my_player) {
        if (debug.info == true) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(`ID : ${my_player.id}`, 5, canvas.height - 450);
            ctx.fillText(`x : ${my_player.hitbox.x}`, 5, canvas.height - 400);
            ctx.fillText(`y : ${my_player.hitbox.y}`, 5, canvas.height - 350);
            ctx.fillText(`dead : ${my_player.morir}`, 5, canvas.height - 300);
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
                    `ID : ${playerManager.personajes[i].id} , dead : ${playerManager.personajes[i].morir}`,
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