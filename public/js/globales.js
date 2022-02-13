// variables globales
var debug = {
    hit: false,
    info: true
};
var io = io.connect(),
    canvas = document.getElementById("myCanvas"),
    keys = [];
var dir = {
    ARRIBA: "arriba",
    ABAJO: "abajo",
    DERECHA: "derecha",
    IZQUIERDA: "izquierda"
};
canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientWidth || document.body.clientWidth;
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientWidth || document.body.clientWidth;
    buclePrincipal.ctx.font = `1.1em 'Oswald', sans-serif`;
}

// TODO: Play sound music backgroud
// canvas.addEventListener(
//     "click",
//     function (evt) {

//         // console.log(music);
//         // // if (!music.overworld.playing()) {
//         // //     soundSetting = 1;
//         // //     music.overworld.play();
//         // // } else {
//         // //     soundSetting = 0;
//         // //     music.overworld.pause();
//         // // }
//     },
//     false
// );

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
io.on('connect_failed', function () {
    console.log('Connect failed');
    io.connect();
});
io.on('reconnect', function () {
    location.reload();
});
io.on('disconnect', function () {
    buclePrincipal.loadScreen(screenManager.screen.DESCO);
    console.log("desconectado...");
});