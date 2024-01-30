class Player {
    constructor(x, y, size, color) {
        this.dir = 0;
        this.speed = 10;
        this.xVel = 0;
        this.angle = 2 * Math.PI;
        this.strenght = 100;
        this.minAngle = 3 / 2 * Math.PI;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
}
class Projectile {
    constructor(x, y, angle, strength) {
        this.speed = .125;
        this.gravity = 9.81;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.strength = strength;
        this.yVel = strength;
    }
}
function updateProjectile(projectile, dt) {
    projectile.x += projectile.strength * Math.cos(projectile.angle) * projectile.speed;
    projectile.y += projectile.yVel * Math.sin(projectile.angle) * projectile.speed;
    projectile.yVel -= projectile.gravity * projectile.speed;
}
function drawProjectile(projectile, ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(projectile.x, projectile.y, 5, 5);
}
function drawPlayer(player, ctx, tankImage) {
    ctx.fillStyle = player.color;
    ctx.drawImage(tankImage, player.x, player.y);
    //Draw Barrel
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(player.x + player.size / 2, player.y + player.size / 6);
    ctx.lineTo(player.x + player.size / 2 + Math.cos(player.angle) * 30, player.y + player.size / 6 + Math.sin(player.angle) * 30);
    ctx.stroke();
    if (player.projectile != null) {
        drawProjectile(player.projectile, ctx);
    }
}
function updatePlayer(player, dt) {
    if (player.projectile != null) {
        updateProjectile(player.projectile, dt);
    }
    movePlayer(player);
}
function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}
function movePlayer(player) {
    if (player.dir != 0) {
        player.xVel = lerp(player.xVel, player.speed * player.dir, 0.3);
    }
    else {
        player.xVel = lerp(player.xVel, 0, 0.5);
    }
    player.x += player.xVel;
}
/*function shoot(player: Player, mouseX, mouseY) {
    player.angle = Math.atan2(mouseX - (player.x + player.size / 2), mouseY - (player.y + player.size / 4));
    player.projectile = new Projectile(player.x + player.size / 2, player.y + player.size / 6, player.angle, 100);
}*/
function shoot(player) {
    player.projectile = new Projectile(player.x + player.size / 2, player.y + player.size / 6, player.angle, player.strenght);
}
//# sourceMappingURL=player.js.map