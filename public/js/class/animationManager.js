var animationManager = {
    imagenes: [],
    personajes: []
};

animationManager.LoadContent = function (callback) {
    let ruta = [];
    let p = ["astronaut", "Frank", "ghost", "knight", "pirate", "pumkin", "sushi", "zombie"];
    p.forEach(el => {
        this.imagenes[el] = [];
        ruta[el] = [];
        for (let n = 0; n <= 29; n++) {
            ruta[el].push("/images/" + el + "_" + n + ".png");
        }
        playerManager.pj.push({ src: "/images/" + el + "_0.png", pj: el });
    });

    // shielding
    this.imagenes["shield"] = [];
    ruta["shield"] = [];
    ruta["shield"].push("/images/spr_shield0.png")
    ruta["shield"].push("/images/spr_shield1.png")
    ruta["shield"].push("/images/spr_shield2.png")

    // cargar bomba
    this.imagenes["bomb"] = [];
    ruta["bomb"] = [];
    for (let n = 0; n <= 3; n++) {
        ruta["bomb"].push("/images/bomb_" + n + ".png");
    }
    // cargar bloques 
    this.imagenes["block"] = [];
    ruta["block"] = [];
    for (let n = 0; n <= 6; n++) {
        ruta["block"].push("/images/block_" + n + ".png");
    }
    this.imagenes["block1"] = [];
    ruta["block1"] = [];
    for (let n = 0; n <= 6; n++) {
        ruta["block1"].push("/images/block_0" + n + ".png");
    }
    // cargar explo 
    this.imagenes["explo"] = [];
    ruta["explo"] = [];
    for (let n = 0; n <= 27; n++) {
        ruta["explo"].push("/images/explo_" + n + ".png");
    }
    // cargar poder 
    this.imagenes["poder"] = [];
    ruta["poder"] = [];
    for (let n = 0; n <= 5; n++) {
        ruta["poder"].push("/images/poder_" + n + ".png");
    }
    // cargar cloud 
    this.imagenes["cloud"] = [];
    ruta["cloud"] = [];
    for (let n = 1; n <= 2; n++) {
        ruta["cloud"].push("/images/cloud" + n + ".png");
    }
    //icon 
    this.imagenes["icon_mute"] = [];
    ruta["icon_mute"] = [];
    ruta["icon_mute"].push("/images/on_Vol.png");
    ruta["icon_mute"].push("/images/mute.png");
    // interface material
    this.imagenes["interface"] = [];
    ruta["interface"] = [];
    ruta["interface"].push("/images/backgroundInterface00.png");
    ruta["interface"].push("/images/backgroundInterface01.png");
    // cargar pared
    this.imagenes["pared"] = [];
    ruta["pared"] = [];
    ruta["pared"].push("/images/pared.png");
    // cargar heart
    this.imagenes["heart"] = [];
    ruta["heart"] = [];
    ruta["heart"].push("/images/heart.png");
    // cargar dead
    this.imagenes["dead"] = [];
    ruta["dead"] = [];
    ruta["dead"].push("/images/dead.png");
    // cargar grass
    this.imagenes["grass"] = [];
    ruta["grass"] = [];
    ruta["grass"].push("/images/grass.png");
    // winner
    this.imagenes["winner"] = [];
    ruta["winner"] = [];
    ruta["winner"].push("/images/WInner.png");
    // time ui
    this.imagenes["time_ui"] = [];
    ruta["time_ui"] = [];
    ruta["time_ui"].push("/images/time_ui.png");
    // final para cargar todas las rutas

    Object.keys(ruta).map(key => {
        ruta[key] = ruta[key].map(images => {
            return `${pathS3}${images}`
        })
    })


    Object.keys(this.imagenes).forEach(element => {
        this.personajes[element] = [];
        this.personajes[element].push(ruta[element]);
    });
    this.imagenes = this.createImages(this.personajes, callback);
}
animationManager.createImages = function (srcs, fn) {

    var n = 0, images = [];
    let all_image = Object.keys(srcs).map((key) => {
        if (srcs[key].length > 0) {
            return srcs[key][0].length
        } else {
            return 0
        }
    }).reduce((pre, current) => {
        return pre += current
    }, 0)

    let countLoadImage = 0


    var progressBar = document.getElementById("myBar");
    var width = 1;

    Object.keys(srcs).forEach(element => {
        var img;
        var remaining = srcs[element][0].length;
        images[element] = new Array();
        for (var i = 0; i < srcs[element][0].length; i++) {
            img = new Image();
            images[element].push(img);
            img.onload = function () {
                --remaining;
                countLoadImage++
                width = (countLoadImage / all_image) * 100
                progressBar.style.width = width + "%";
                progressBar.innerText = `${width.toFixed(1)}%`
                if (remaining == 0 && n == Object.keys(srcs).length - 1) {
                    fn();
                };
                if (remaining == 0)
                    ++n;
            };
            img.src = srcs[element][0][i];
        }
    });
    return (images);
}