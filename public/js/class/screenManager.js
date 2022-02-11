var screenManager = {
    screen: {
        GAME: "inGame",
        LOADING: "loading",
        MENU: "menu",
        DESCO: "desconectado"
    },
    check: {
        img: false,
        block: false,
        power: false
    }
};

screenManager.LoadContent = function (screen) {
    switch (screen) {
        case screenManager.screen.DESCO:
            let span = document.createElement("span");
            span.id = "reconectar";
            span.append("Reconectando...");
            $("body").append(span);
            break;
        case screenManager.screen.MENU:
            menuManager.LoadContent();
            break;
        case screenManager.screen.LOADING:
            let pan = document.createElement("span");
            pan.id = "conectando";
            pan.append("Cargando...");
            $("body").append(pan);
            blockManager.LoadContent();
            animationManager.LoadContent(
                function () {
                    screenManager.check.img = true;
                });
            powerManager.LoadContent();
            break;
    }
};
screenManager.Draw = function (ctx, screen) {

    switch (screen) {

        case screenManager.screen.GAME:

            ctx.save();
            const scale = 2;
            ctx.transform(
                scale,
                0,
                0,
                scale,
                -camera.x * scale - camera.w / 2,
                -camera.y * scale - camera.h / 2
            );
            blockManager.Draw(ctx);
            powerManager.Draw(ctx);
            bombManager.Draw(ctx);
            playerManager.Draw(ctx);
            ctx.restore();
            hudManager.Draw(ctx);
            break;
    }
};
screenManager.Update = function (screen, callback) {
    switch (screen) {
        case screenManager.screen.LOADING:
            if (screenManager.cheking()) {
                document.getElementById("conectando").remove();
                callback(screenManager.screen.MENU);
                console.log("¡Cargado!");
            }
            break;
        case screenManager.screen.MENU:
            menuManager.Update();
            break;
        case this.screen.GAME:
            blockManager.Update();
            powerManager.Update();
            playerManager.Update();
            bombManager.Update();
            hudManager.Update();
            break;
    }
};
screenManager.UnLoadContent = function (screen) {
    switch (screen) {
        case screenManager.screen.MENU:
            menuManager.UnLoadContent();
            break;
    }
}
screenManager.cheking = function () {
    return this.check.img && this.check.block && this.check.power;
}

io.on('inicio', function () {
    var img = document.createElement("img");
    img.src = animationManager.imagenes["dead"][0].src;
    img.id = "imagenDead";
    $("body").append(img);
    setTimeout(
        function () {
            img.remove();
            location.reload();
            window.location.href = window.location;
            window.location.reload();
        }, 4000);

});