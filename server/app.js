var express = require('express'); // se llama la libreria express
var app = express(); // se crea un objeto de la libreria
var server = require('http').Server(app); // se llama la libreria http y se manda express
var io = require('socket.io').listen(server, {
    pingInterval: 3000
}); // se escucha del servidor con la libreria de sockets
var path = require('path'); // Se llama la libreria Path para path's
var fs = require('fs');
var public = '/../public'; // Paths donde esta la parte publica
var map = '/mapJSON/';
var favicon = require('serve-favicon');
var _ = require('underscore')
const { v4: uuidv4 } = require('uuid');
app.use('/css', express.static(path.resolve(__dirname + public + '/css'))); // direccion del css
app.use('/js', express.static(path.resolve(__dirname + public + '/js'))); // direccion del javascript
app.use('/img', express.static(path.resolve(__dirname + public + '/img'))); // direccion de las imagenes
app.use("/music", express.static(path.resolve(__dirname + public + "/music")));
app.use("/images", express.static(path.resolve(__dirname + public + "/images"))); // direccion de las imagenes
app.use(favicon(path.join(__dirname + public + '/favicon.ico')));



var room_data = {

}

var init_data = {
    mapa: [],
    lastPlayderID: 0,
    bombas: [],
    powers: [],
    leaderboard: [],
    player: {},
    limit_area_patthen: [],
    player_state: {

    },
    closeIndexBlock: [],
    sec: 0,
    round: 1,
    isFinalRound: false,
    endGame: false,
    index_map: [],
    border_start: {
        x: 1,
        y: 1
    },
    vectorX: [],
    vectorY: []
}



app.get('/public/:roomId/:user_id', function (req, res) {
    res.sendFile(path.resolve(__dirname + public + '/index.html')); // si se pide / llama al index
});

// Start server
server.listen(process.env.PORT || 8080, '0.0.0.0', function () {
    console.log('Start port : ' + server.address().port);
});

function posicionRandom(roomId) {
    var j = getRndInteger(0, room_data[roomId].vectorX.length - 1);

    var c = {
        x: room_data[roomId].vectorX[j] * 32,
        y: room_data[roomId].vectorY[j] * 32,
    };

    if (j == 0) {
        // center of map
        c.x = 19 * 32;
        c.y = 15 * 32;
    }
    return c;
}

function genPositionCanspawn(roomId) {

    var map2d = _.chunk(
        room_data[roomId].mapa.data,
        room_data[roomId].mapa.width
    );

    var arrayX = [];
    var arrayY = [];

    for (var level_1 = 0; level_1 < map2d.length - 1; level_1++) {
        for (let level_2 = 0; level_2 < map2d[level_1].length - 1; level_2++) {
            try {
                var top = map2d[level_1 - 1][level_2];
            } catch (error) {
                var top = undefined;
            }

            try {
                var left = map2d[level_1][level_2 - 1];
            } catch (error) {
                var left = undefined;
            }

            try {
                var right = map2d[level_1][level_2 + 1];
            } catch (error) {
                var right = undefined;
            }

            try {
                var bottom = map2d[level_1 - 1][level_2];
            } catch (error) {
                var bottom = undefined;
            }

            if (map2d[level_1][level_2] == 0) {
                // can spawn

                if (top != undefined && top == 0 && left != undefined && left == 0) {
                    arrayX.push(level_2);
                    arrayY.push(level_1);
                    continue;
                }

                if (
                    top != undefined &&
                    top == 0 &&
                    right != undefined &&
                    right == 0
                ) {
                    arrayX.push(level_2);
                    arrayY.push(level_1);
                    continue;
                }

                if (
                    left != undefined &&
                    left == 0 &&
                    bottom != undefined &&
                    bottom == 0
                ) {
                    arrayX.push(level_2);
                    arrayY.push(level_1);
                    continue;
                }

                if (
                    right != undefined &&
                    right == 0 &&
                    bottom != undefined &&
                    bottom == 0
                ) {
                    arrayX.push(level_2);
                    arrayY.push(level_1);
                    continue;
                }
            }
        }
    }
    room_data[roomId].vectorX = arrayX;
    room_data[roomId].vectorY = arrayY;
}

function closePlayArea(indexData, border) {
    let areaData = indexData;
    let { x, y } = border;

    let topBorders = [],
        bottomBorders = [],
        leftBorders = [],
        rightBorders = [],
        decreaseBorderOfRound = [];

    for (let i = x; i < areaData.length - x; i++) {
        topBorders.push(areaData[i][y]);
        rightBorders = areaData[i].slice(x, areaData[i].length - 1);
        leftBorders = areaData[x].slice(x, areaData[i].length - 1);
        bottomBorders.push(areaData[i][leftBorders.length]);
    }

    decreaseBorderOfRound = [
        ...new Set([
            ...topBorders,
            ...leftBorders,
            ...rightBorders,
            ...bottomBorders,
        ]),
    ];

    return decreaseBorderOfRound;
}

async function initClose(round, roomId, isFinalRound) {
    let mapIndexData = convertTo2DimensionArray(room_data[roomId].mapa);
    room_data[roomId].index_map = mapIndexData
    var closeIndexBlock = []
    if (isFinalRound == true) {
        closeIndexBlock = Array.apply(null, { length: room_data[roomId].mapa.data.length }).map(Number.call, Number)
        room_data[roomId].closeIndexBlock = closeIndexBlock
        room_data[roomId].mapa["data"] = Array.apply(null, { length: room_data[roomId].mapa.data.length }).map(Number.call, () => 1)
    } else {
        closeIndexBlock = await closePlayArea(
            room_data[roomId].index_map,
            room_data[roomId].border_start
        );
        room_data[roomId].closeIndexBlock = room_data[roomId].closeIndexBlock.concat(closeIndexBlock);
        for (let i = 0; i < closeIndexBlock.length; i++) {
            let dataTest = closeIndexBlock[i];
            room_data[roomId].mapa["data"][dataTest] = 1;
        }
    }

    //loop change data of block to change data to unmovable area
    io.to(roomId).emit("MAP_REDUCE_SPACE", room_data[roomId].closeIndexBlock);


    // increase border of round
    room_data[roomId].border_start.x += 1;
    room_data[roomId].border_start.y += 1;
    // room_data[roomId].mapa = mapa;
}

function countDownPromise(time, round, isFinalRound, roomId) {
    return new Promise((r, j) => {
        if (typeof time === "number") {
            var sec = time;
            var updateSecInterval = setInterval(() => {
                sec -= 1;
                room_data[roomId].sec = sec;
                room_data[roomId].round = round;
                room_data[roomId].isFinalRound = isFinalRound;
                if (room_data[roomId].endGame == true) {
                    clearInterval(updateSecInterval);
                }



                io.to(roomId).emit("COUNTDOWN", { round, sec, isFinalRound });
                if (sec == 0) {
                    console.log(`Room : ${roomId} Round : ${round} [CLOSE]`);
                    // clear round
                    // disable function initClose
                    initClose(round, roomId, isFinalRound);
                    genPositionCanspawn(roomId)
                    clearInterval(updateSecInterval);
                    r(true);
                }
            }, 1000);
        }
    })
}
async function countDown(roomId) {
    console.log(`PROCESS COUNTDOWN ROOM : ${roomId}`);
    for (
        let index = 0;
        index < room_data[roomId].limit_area_patthen.length;
        index++
    ) {
        if (room_data[roomId].endGame == true) {
            break;
        }
        const { time_sec, round, final } = room_data[roomId].limit_area_patthen[index];
        await countDownPromise(
            Number(time_sec),
            round,
            index == room_data[roomId].limit_area_patthen.length - 1,
            roomId
        );
    }

    this.endGame = true
    io.to(roomId).emit("TIME_OVER", { message: "TIME_OVER" });
}


function checkRoomCreate(roomId) {
    return new Promise(function (resolve, reject) {

        try {
            if (room_data[roomId] == undefined) { // init room data
                room_data[roomId] = JSON.parse(JSON.stringify(init_data))

                let fileContent = fs.readFileSync(path.resolve(__dirname + map + 'mapa.json'), 'utf8')
                room_data[roomId].mapa = JSON.parse(fileContent)["layers"][0]
                let n = 0;
                room_data[roomId].mapa['data'].forEach(layer => {
                    if (layer == 2) {
                        let number = Math.random() * 10;
                        if (number > 6) { // for test 0 real 6
                            room_data[roomId].mapa['data'][n] = 0;
                        } else {
                            let ran_number = Math.random() * 10;
                            if (ran_number > 6) {
                                room_data[roomId].mapa['data'][n] = 2;
                            } else {
                                room_data[roomId].mapa['data'][n] = 3;
                            }
                        }
                    }
                    n += 1;
                });

                var fileContentPattern = fs.readFileSync(path.resolve(__dirname + map + "limit_area_pattern.json"), "utf8")
                room_data[roomId].limit_area_patthen = JSON.parse(fileContentPattern)

                let mapIndexData = convertTo2DimensionArray(room_data[roomId].mapa);
                room_data[roomId].index_map = mapIndexData
                room_data[roomId].border_start = {
                    x: 1,
                    y: 1,
                }
                genPositionCanspawn(roomId)
                // TODO: Start Count Down time
                countDown(roomId)
                resolve("created room")
            } else {
                resolve("already have room")
            }
        } catch (error) {
            reject(error)
        }


    })

}

io.on('connection', function (socket) {
    socket.on("join-room", function (roomId, playerId) {

        checkRoomCreate(roomId)
            .then((result) => {
                console.log(`JOIN ROOM : ${roomId}`);
                console.log(`ROOM STATUS : ${result}`)
                socket.join(roomId);
                socket.lifes = 3;
                socket.kills = 0;
                socket.roomId = roomId
                socket.emit('lifes', socket.lifes);
                socket.emit('mapa', room_data[roomId].mapa);
                socket.emit('kill', socket.kills);
            })
            .catch((error) => {
                console.log(`JOIN ROOM : ${roomId}`);
                console.log(`ROOM STATUS : ${error}`)
            })

    })
    socket.on('powers', function () {
        socket.emit('powers', room_data[socket.roomId].powers);
    });
    socket.on('user', function (data, pj, playerId, roomId) {
        // console.log(roomId);
        let randomPosition = posicionRandom(roomId);
        socket.emit("newID", playerId, data, pj, randomPosition);
        socket.emit("allplayers", getAllPlayer(socket.id, socket.roomId));
    });
    socket.on("new_player", function (data) {

        // check player data if exist have to force disconnect
        if (room_data[socket.roomId].player[data.id] == undefined) {
            socket.player = data;
            socket.player.timeShield = 10000
            socket.player.timeShieldCount = 0
            room_data[socket.roomId].player[data.id] = data
            socket.to(socket.roomId).broadcast.emit("new_player", data);
            let leader = getLeaderBoard(socket.roomId);
            if (room_data[socket.roomId].leaderboard != leader) {
                room_data[socket.roomId].leaderboard = leader;
                io.to(socket.roomId).emit('leaderboard', leader);
            } else {
                socket.emit('leaderboard', room_data[socket.roomId].leaderboard);
            }
        } else {

            socket.disconnect()
            console.log("duplicate login Player");
        }

    });

    socket.on("time_out_shield", function (playerId, timeShieldCount) {
        if (socket.player) {
            socket.player.timeShieldCount = timeShieldCount;
            room_data[socket.roomId].player[socket.player.id] = socket.player
            socket.emit('time_out_shield', playerId, timeShieldCount)
        }
    })

    socket.on("mover", function (data) {
        let p = socket.player;
        if (p) {

            p.x = data.x;
            p.y = data.y;
            p.hitbox.x = data.x + p.posHitX;
            p.hitbox.y = data.y + p.posHitY;
            p.animaciones.stop = data.animaciones.stop;
            p.dir = data.dir;
            let pack = {
                id: p.id,
                x: p.x,
                y: p.y,
                dead: p.dead,
                dir: p.dir,
                animaciones: { stop: data.animaciones.stop }
            };
            // update player state
            room_data[socket.roomId].player[p.id] = p
            socket.to(socket.roomId).broadcast.emit("mover", pack);
        }
    });
    socket.on('newBomb', function (data) {
        if (socket.player) {
            socket.player.numBomb -= 1;
            let pack = { id: socket.player.id, x: data.x, y: data.y, bombId: uuidv4() }
            room_data[socket.roomId].player[socket.player.id] = socket.player
            io.to(socket.roomId).emit('newBomb', pack);
        }
    });

    // kick bomb
    socket.on('kickBomb', function ({ currentPosition, nextPosition, direction, bombId }) {
        if (socket.player) {
            var map2d = _.chunk(
                room_data[socket.roomId].mapa.data,
                room_data[socket.roomId].mapa.width
            );
            var x = Math.floor(nextPosition.x / 32);
            var y = Math.floor(nextPosition.y / 32);
            var statusContinue = true;
            var countBox = 0;
            var limitKickBomeBox = 5;
            switch (direction) {
                case "LEFT_TO_RIGHT": {
                    while (statusContinue) {
                        try {
                            if (map2d[y][x] != 0) {
                                statusContinue = false;
                                break;
                            }

                            if (countBox >= limitKickBomeBox) {
                                statusContinue = false;
                                break;
                            }

                            if (x > 100) {
                                statusContinue = false;
                                break;
                            }

                            x += 1;
                            countBox += 1;
                        } catch (error) {
                            statusContinue = false;
                        }
                    }
                    nextPosition.x = (x - 1) * 32;
                    nextPosition.y = y * 32;
                    break;
                }
                case "RIGHT_TO_LEFT": {
                    while (statusContinue) {
                        try {
                            if (map2d[y][x] != 0) {
                                statusContinue = false;
                                break;
                            }

                            if (countBox >= limitKickBomeBox) {
                                statusContinue = false;
                                break;
                            }

                            if (x < -5) {
                                statusContinue = false;
                                break;
                            }
                            x -= 1;
                            countBox += 1;
                        } catch (error) {
                            statusContinue = false;
                            break;
                        }
                    }
                    nextPosition.x = (x + 1) * 32;
                    nextPosition.y = y * 32;
                    break;
                }
                case "TOP_TO_BOTTOM": {
                    while (statusContinue) {
                        try {
                            if (map2d[y][x] != 0) {
                                statusContinue = false;
                                break;
                            }

                            if (countBox >= limitKickBomeBox) {
                                statusContinue = false;
                                break;
                            }

                            if (y > 100) {
                                statusContinue = false;
                                break;
                            }
                            y += 1;
                            countBox += 1;
                        } catch (error) {
                            statusContinue = false;
                            break;
                        }
                    }
                    nextPosition.x = x * 32;
                    nextPosition.y = (y - 1) * 32;
                    break;
                }
                case "BOTTOM_TO_TOP": {
                    while (statusContinue) {
                        try {
                            if (map2d[y][x] != 0) {
                                statusContinue = false;
                                break;
                            }

                            if (countBox >= limitKickBomeBox) {
                                statusContinue = false;
                                break;
                            }

                            if (y < -5) {
                                statusContinue = false;
                                break;
                            }
                            y -= 1;
                            countBox += 1;
                        } catch (error) {
                            statusContinue = false;
                            break;
                        }
                    }
                    nextPosition.x = x * 32;
                    nextPosition.y = (y + 1) * 32;
                    break;
                }
                default: {
                    break;
                }
            }

            if (countBox != 0) {
                io.to(socket.roomId).emit("kickBomb", {
                    currentPosition,
                    nextPosition,
                    direction,
                    bombId: bombId
                });
            }

        }
    })

    socket.on('msPing', function (data) {
        socket.emit('msPong', data);
    });
    socket.on('aumentarKill', function (playerId1, playerId2) {
        var player = getPlayerID(playerId2, socket.roomId)
        if (player) {
            if (player.dead == false) {
                socket.kills += 1;
                socket.emit('kill', socket.kills);
                let leader = getLeaderBoard(socket.roomId);
                if (room_data[socket.roomId].leaderboard != leader) {
                    room_data[socket.roomId].leaderboard = leader;
                    io.to(socket.roomId).emit('leaderboard', room_data[socket.roomId].leaderboard);
                }
            }

        }

    });
    socket.on('killfeed', function (playerId1, playerId2) {
        var player = getPlayerID(playerId2, socket.roomId);
        if (player) {
            if (player.dead == false) {
                io.to(socket.roomId).emit("killfeed", room_data[socket.roomId].player[playerId1], room_data[socket.roomId].player[playerId2])
            }
        }

    })
    socket.on('sumBomb', function () {
        if (socket.player)
            socket.player.numBomb += 1;
        room_data[socket.roomId].player[socket.player.id] = socket.player
    });
    socket.on('eliminatePower', function (index, player) {
        if (room_data[socket.roomId].powers[index] != -1) {
            socket.player = player;
            room_data[socket.roomId].player[socket.player.id] = socket.player
            socket.to(socket.roomId).broadcast.emit('actualizarPower', player, index);
            room_data[socket.roomId].powers[index] = -1;
        }
    });
    socket.on('destroyBlock', function (data) {

        if (room_data[socket.roomId].mapa['data'][data] != 0) {
            room_data[socket.roomId].mapa['data'][data] = 0;
            // TODO: Drop rate item edit here
            if (getRndInteger(1, 100) >= 75) { // drop item 25% rate
                let ran = getRndInteger(0, 24);
                let typePower;
                if (ran < 1) typePower = 1;
                else if (ran <= 15) typePower = 1;
                else if (ran <= 20) typePower = 2;
                else if (ran <= 24) typePower = 3;
                io.to(socket.roomId).emit('generatePosPower', { id: data, type: typePower });
                room_data[socket.roomId].powers[data] = typePower;
            }
            else {
                io.to(socket.roomId).emit('generatePosPower', { id: data, type: -1 });
                room_data[socket.roomId].powers[data] = -1;
            }

            socket.to(socket.roomId).broadcast.emit('destroyBlock', data);
        }
    });
    socket.on('dead', function (id) {
        var player = getPlayerID(id, socket.roomId);
        if (player) {
            player.dead = true;
            player.timeShieldCount = 0
            if (id == socket.player.id) {
                socket.lifes -= 1;
                socket.emit('lifes', socket.lifes);
            }
            io.to(socket.roomId).emit('dead', player.id);
        }
    });
    socket.on('delete', function () {
        if (socket.player) {
            if (socket.lifes < 0) {
                delete socket.player;
                let leader = getLeaderBoard(socket.roomId);
                if (room_data[socket.roomId].leaderboard != leader) {
                    room_data[socket.roomId].leaderboard = leader;
                    io.to(socket.roomId).emit('leaderboard', room_data[socket.roomId].leaderboard);
                }
                socket.emit('beginning');
            } else {
                // TODO : have to reset buff here
                socket.player.dead = false;
                socket.player.timeShieldCount = 0;
                socket.player.largeBomb = 1
                socket.player.numMaxBomb = 1
                socket.player.numBomb = 1
                socket.player.vel = 2
                room_data[socket.roomId].player[socket.player.id] = socket.player
                let c = posicionRandom(socket.roomId);
                cambiarPos(c.x, c.y, socket.player);
                setTimeout(
                    function () {
                        io.to(socket.roomId).emit('new_player', socket.player)
                    }, 3000);
            }
        }
    });
    socket.on('disconnect', function (reason) {

        if (reason === 'io server disconnect')
            socket.connect();
        else
            if (socket.player) {
                socket.player.dead = true;
                room_data[socket.roomId].player[socket.player.id] = socket.player
                socket.to(socket.roomId).broadcast.emit('dead', socket.player.id);
                delete room_data[socket.roomId].player[socket.player.id]
                delete socket.player;
                let leader = getLeaderBoard(socket.roomId);
                if (room_data[socket.roomId].leaderboard != leader) {
                    room_data[socket.roomId].leaderboard = leader;
                    io.to(socket.roomId).emit('leaderboard', room_data[socket.roomId].leaderboard);
                }
            }
    });
    socket.on('error', (error) => {
        console.log('error: ' + error);
    });
    socket.on('connect_error', (error) => {
        console.log('error: ' + error);
        try {
            socket.connect();
        } catch (err) {
            console.log("Error de reconectar : " + err);
        }
    });
});
function getAllPlayer(id, roomId) {
    var players = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        if (io.sockets.connected[socketID].roomId == roomId) {
            var player = io.sockets.connected[socketID].player;
            if (player && socketID != id) players.push(player);
        }

    });
    return players;
}
function getPlayerID(id, roomId) {
    let player;
    var returnPlayer;
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        if (io.sockets.connected[socketID].roomId == roomId) {
            player = io.sockets.connected[socketID].player;
            if (player && player.id == id) {
                returnPlayer = player;
            }
        }

    });
    return returnPlayer;
}

function getLeaderBoard(roomId) {
    let player, kills;
    let players = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        if (io.sockets.connected[socketID].roomId == roomId) {
            player = io.sockets.connected[socketID].player;
            if (player) {

                kills = io.sockets.connected[socketID].kills;
                players.push({ kills, user: player.user, id: player.id });
            }
        }

    });
    players.sort(function (a, b) {
        if (a.kills < b.kills) {
            return 1;
        }
        if (a.kills > b.kills) {
            return -1;
        }
        return 0;
    });
    if (players.length > 5) {
        players = players.slice(0, 5);
    }
    return players;
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function cambiarPos(x, y, player) {
    player.hitbox.x = x;
    player.hitbox.y = y;
    player.x = x - player.posHitX;
    player.y = y - player.posHitY;
}

function convertTo2DimensionArray(mapData) {
    // define variable
    let indexData = [];

    let width = mapData["width"],
        height = mapData["height"];

    // loop for push index of array in width length
    for (let i = 0; i < width; i++) {
        indexData.push(i);
        indexData[i] = [];

        let heightIndexData = 0 + i;

        for (let j = 0; j < height; j++) {
            indexData[i].push(heightIndexData);
            heightIndexData += width;
        }
    }

    return indexData;
}