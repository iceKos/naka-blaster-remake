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
            let div = document.createElement("div");
            div.id = "reconnecting";
            div.append("Reconnecting...");
            $("body").append(div);
            break;
        case screenManager.screen.MENU:
            menuManager.LoadContent();
            break;
        case screenManager.screen.LOADING:
            let pan = document.createElement("div");
            pan.id = "connecting";
            let divLoadding = document.createElement("div");
            divLoadding.innerHTML = `
            LOADDING
            <div id="myProgress">
                <div id="myBar">0%</div>
            </div>
            `
            pan.append(divLoadding);
            $("body").append(pan);
            blockManager.LoadContent();
            animationManager.LoadContent(
                function () {
                    screenManager.check.img = true;
                    hudManager.LoadContent()
                });
            powerManager.LoadContent();
            cloudManager.LoadContent();
            
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
            cloudManager.Draw(ctx);
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
                document.getElementById("connecting").remove();
                callback(screenManager.screen.MENU);
                console.log("¡Cargado!");
            }
            break;
        case screenManager.screen.MENU:
            menuManager.Update();
            break;
        case this.screen.GAME:
            cloudManager.Update();
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

io.on('beginning', function () {

    var img = document.createElement("img");
    var el = document.createElement("div");
    el.id = "box-dead";
    img.src = animationManager.imagenes["dead"][0].src;
    img.id = "img-dead";
    img.width = "20%";
    img.height = "5%";

    el.append(img);
    $("body").append(el);

    if (record_status == true) {
        setTimeout(() => {
            mediaRecorder.stop();
        }, 4000);

    }
    // setTimeout(
    //     function () {
    //         img.remove();
    //         location.reload();
    //         window.location.href = window.location;
    //         window.location.reload();
    //     }, 4000);

});