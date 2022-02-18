var menuManager = { pressDer: true, pressIzq: true };
menuManager.LoadContent = function () {
    this.overlay = document.createElement("div")
    this.overlay.id = "screen-overlay"
    this.content = document.createElement("div");
    this.content.id = "content";
    this.divo = document.createElement("div");
    this.divo.id = "contentform";
    this.divpj = document.createElement("div");
    this.divpj.id = "personajes";
    let span, h4;
    h4 = document.createElement("h4");
    h4.id = "selectAplayer";
    h4.append("Select a player: ");
    this.content.append(h4);
    this.clear = document.createElement("div");
    this.clear.className = "clear";
    this.content.append(this.clear);
    for (var i = 0; i < playerManager.pj.length; i++) {
        let img
        span = document.createElement("span");
        img = document.createElement("img");
        img.id = "pj_" + i;
        img.className = "character";
        img.alt = playerManager.pj[i]["pj"];
        img.src = playerManager.pj[i]["src"];
        img.style.width = "80px";
        img.style.height = "80px";
        img.addEventListener("click", function (e) {
            let selecteds = document.getElementsByClassName("selected");
            for (let j = 0; j < selecteds.length; j++) {
                selecteds[j].className = "";
            }
            window.location.hash = "#" + img.id;
            this.className = "selected";
        });
        span.append(img);
        this.divpj.append(span);
    }


    this.inputText = document.createElement("input");
    this.inputText.type = "text";
    this.inputText.id = "inputText";
    this.button = document.createElement("button");
    this.button.id = "boton";
    this.button.append("cool");
    this.span = document.createElement("span");
    this.span.id = "texto";
    this.spanError = document.createElement("span");
    this.spanError.id = "spanError";
    this.span.append("Username: ");
    this.divo.append(this.inputText);
    this.divo.append(this.button);
    this.clear = document.createElement("div");
    this.clear.className = "clear";
    this.content.append(this.span);
    this.content.append(this.spanError);
    this.content.append(this.divo);
    this.content.append(this.clear);
    this.content.append(this.divpj);
    document.body.addEventListener("keyup", function (event) {
        event.preventDefault();
        // el boton enter 
        if (event.keyCode === 13) {
            // simula el clic en el boton
            menuManager.button.click();
        }
    });

    // cut to game screen
    setTimeout(() => {
        io.emit('user', chance.name(), "zombie", playerId, roomId);
        buclePrincipal.screen = screenManager.screen.GAME;
        menuManager.Destroy();
    }, 10);

    // evento del clic en el boton 
    this.button.addEventListener("click", function () {
        let str = menuManager.inputText.value;
        str = str.trim();
        if (str == "")
            menuManager.spanError.innerHTML = "EMPTY FIELD ERROR";
        else if (/.{9}/g.test(str))
            menuManager.spanError.innerHTML = "ERROR 9 OR LESS CHARACTERS";
        else if (/\s/g.test(str))
            menuManager.spanError.innerHTML = "ERROR THERE ARE SPACES";
        else {
            let persona = document.getElementsByClassName("selected");
            let pj;
            if (window.location.hash) {
                let lel = window.location.hash.substring(1, window.location.hash.length);
                pj = document.getElementById(lel).alt;
            } else {
                pj = "zombie";
            }
            if (persona.length != 0) {
                pj = persona[0].alt;
            }
            if (animationManager.imagenes[pj]) {
                io.emit('user', str, pj);
                buclePrincipal.screen = screenManager.screen.GAME;
                menuManager.Destroy();
            } else {
                console.log("error imagen invalida ");
            }
        }
    });
    document.body.addEventListener("wheel", function (e) {
        menuManager.pressDer = e.wheelDelta < 0;
        menuManager.pressIzq = e.wheelDelta > 0;
    });
    $("body").append(this.content);
    $("body").append(this.overlay)


    if (window.location.hash) {
        let lel = window.location.hash.substring(1, window.location.hash.length);
        if (document.getElementById(lel)) {
            document.getElementById(lel).click();
        }
    }
}
menuManager.Update = function () {

}
menuManager.UnLoadContent = function () {
    this.Destroy();
}
menuManager.Destroy = function () {
    this.content.remove();
    this.overlay.remove();
}