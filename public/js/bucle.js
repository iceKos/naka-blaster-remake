// 1 segundo =  1000ms
var buclePrincipal = {
    idEjecucion: null,
    ultimoRegistro: 0,
    aps: 0,                         // contador de actulizaciones
    fps: 0,
    static_fps: 60,
    maxFps: 0,                         // contador de fps
    ping: 0,
    ctx: null,                      // el canvas del DOM                  // vector de personajes
    dibujarFps: "APS: 0 | FPS: 0 | MS: 0",
    screen: screenManager.screen.LOADING,
    iterar: function (registroTemporal) {
        buclePrincipal.idEjecucion = setTimeout(() => {
            window.requestAnimationFrame(
                buclePrincipal.iterar
            );
        }, 1000 / buclePrincipal.static_fps);
        // buclePrincipal.idEjecucion = window.requestAnimationFrame(
        //     buclePrincipal.iterar
        // );
        buclePrincipal.limpiar();
        buclePrincipal.Update(registroTemporal);
        buclePrincipal.Draw();
        if (registroTemporal - buclePrincipal.ultimoRegistro > 999) {
            buclePrincipal.ultimoRegistro = registroTemporal;
            //console.log("APS: "+ buclePrincipal.aps + " | FPS: "+ buclePrincipal.fps);
            buclePrincipal.dibujarFps = "APS: " + buclePrincipal.aps + " | FPS: " + buclePrincipal.fps + " | PING: " + buclePrincipal.ping + " | SOLID: " + hudManager.solid;
            buclePrincipal.aps = 0;
            buclePrincipal.maxFps = buclePrincipal.fps;
            buclePrincipal.fps = 0;
        }
    },
    Update: function () {
        screenManager.Update(this.screen, this.loadScreen);
        buclePrincipal.aps++;
    },
    Draw: function () {
        screenManager.Draw(buclePrincipal.ctx, this.screen);
        if (debug.info) {
            buclePrincipal.ctx.fillStyle = '#FFFFFF';
            if (playerManager.personajes[playerManager.id] != null) buclePrincipal.ctx.fillText(buclePrincipal.dibujarFps + " | X: " + playerManager.personajes[playerManager.id].hitbox.x + " | Y: " + playerManager.personajes[playerManager.id].hitbox.y, 0, 17);
            else buclePrincipal.ctx.fillText(buclePrincipal.dibujarFps, 0, 17);
        } else {
            buclePrincipal.ctx.fillStyle = '#FFFFFF';
            buclePrincipal.ctx.fillText("MS: " + buclePrincipal.ping, 0, 17);
        }
        buclePrincipal.fps++;
    },
    limpiar: function () {
        buclePrincipal.ctx.fillStyle = "#8e44ad";
        buclePrincipal.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
};
buclePrincipal.LoadContent = function () {
    screenManager.LoadContent(this.screen);
};
buclePrincipal.loadScreen = function (screen) {
    screenManager.UnLoadContent(buclePrincipal.screen);
    buclePrincipal.screen = screen;
    buclePrincipal.LoadContent();
};