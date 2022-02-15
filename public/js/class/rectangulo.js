class rectangulo {
    constructor(x, y, ancho, alto) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
    }
    Draw(ctx) {
        if (camera.x - 32 < this.x && camera.x + camera.w > this.x &&
            camera.y - 32 < this.y && camera.y + camera.h > this.y) {
            ctx.strokeStyle = "rgb(250, 0, 0)"; // color de los trazos
            ctx.strokeRect(this.x, this.y, this.ancho, this.alto);
            ctx.fillStyle = 'rgba(250, 0, 0, 0.3)';
            ctx.fillRect(this.x, this.y, this.ancho, this.alto);
        }
    }
    copy() {
        return new rectangulo(this.x, this.y, this.ancho, this.alto);
    }

    // Check hit to other object
    chocarCon(otherobj) {
        var left = this.x;
        var right = this.x + (this.ancho);
        var above = this.y;
        var below = this.y + (this.alto);
        var otherleft = otherobj.x;
        var otherRight = otherobj.x + (otherobj.ancho);
        var otherTop = otherobj.y;
        var otherDown = otherobj.y + (otherobj.alto);
        // console.log({ above, below, left, right},{otherTop: otherDown,otherleft,});
        var hit = true;
        if ((below <= otherTop) ||
            (above >= otherDown) ||
            (right <= otherleft) ||
            (left >= otherRight)) {
            hit = false;
        }
        // console.log({ chocar, otherobj });
        return hit;
    }
}