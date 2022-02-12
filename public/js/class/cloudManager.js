var cloudManager = {
    clouds: [],
};

cloudManager.LoadContent = function () {
    for (let index = 0; index < 50; index++) {
        this.clouds.push(
            new cloud(getRandomInt(-500, canvas.width), getRandomInt(-500, canvas.height))
        )

    }
}

cloudManager.Draw = function (ctx) {
    this.clouds.forEach(element => {
        element.Draw(ctx);
    });
}

cloudManager.Update = function () {
    this.clouds.forEach(element => {
        element.Update()
    });
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}