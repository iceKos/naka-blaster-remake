let searchParams = new URLSearchParams(window.location.search);

const data = window.location.pathname.split('/')
var roomId = data[2]
var playerId = data[3]
// var pathS3 = `https://nakamoto-prod.s3.eu-central-1.amazonaws.com/naka_blaster`
var pathS3 = ``
// variables globales
var debug = {
    hit: false,
    info: false
};
var io = io.connect(),
    canvas = document.getElementById("myCanvas"),
    keys = [];
var dir = {
    UP: "UP",
    DOWN: "DOWN",
    RIGHT: "RIGHT",
    LEFT: "LEFT"
};
var soundSetting = 1
var record_status = false


canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientWidth || document.body.clientWidth;
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientWidth || document.body.clientWidth;
    buclePrincipal.ctx = canvas.getContext("2d");
    buclePrincipal.ctx.font = `1.1em 'Oswald', sans-serif`;
}


canvas.addEventListener('click', (e) => {
    const pos = {
        x: e.clientX,
        y: e.clientY
    };
    hudManager.buttons.forEach((b, i) => {
        if (isIntersect(pos, b)) {
            b.callback()
        }
    });
});


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

io.on('connect', function () {
    // join room here
    io.emit("join-room", roomId, playerId)
});
io.on('connect_failed', function () {
    console.log('Connect failed');
    io.connect();
});
io.on('reconnect', function () {
    console.log("reconnect");
    location.reload();
});
io.on('disconnect', function () {
    buclePrincipal.loadScreen(screenManager.screen.DESCO);
    console.log("desconectado...");
});