const canvas = document.getElementById("gameArea");
class Player {
    constructor(x, y, size, color) {
        this.dir = 0;
        this.speed = 10;
        this.xVel = 0;
        this.angle = 2 * Math.PI;
        this.strenght = 100;
        this.minAngle = 3 / 2 * Math.PI;
        this.shootTimer = 0;
        this.shootSpeed = 4;
        this.projectiles = [];
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
}
function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
class GroundTile {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
function updateProjectile(projectiles, ground, dt) {
    projectiles.forEach((projectile) => {
        if (projectile.x > canvas.width || projectile.x < 0 || projectile.y < 0 || projectile.y > canvas.height) {
            delete projectiles[projectiles.indexOf(projectile)];
        }
        else {
            projectile.x += projectile.strength * Math.cos(projectile.angle) * projectile.speed;
            projectile.y += projectile.yVel * Math.sin(projectile.angle) * projectile.speed;
            projectile.yVel -= projectile.gravity * projectile.speed;
            if (projectile.y > 600) {
                let x = projectile.x;
                let y = projectile.y;
                let destroyed = false;
                ground.forEach((tile) => {
                    if (calcDistance(projectile.x, projectile.y, tile.x + tile.width / 2, tile.y + tile.height / 2) < tile.width) {
                        delete projectiles[projectiles.indexOf(projectile)];
                        destroyed = true;
                        return;
                    }
                });
                if (destroyed) {
                    ground.forEach((tile) => {
                        if (calcDistance(x, y, tile.x + tile.width / 2, tile.y + tile.height / 2) < tile.width * 4) {
                            delete ground[ground.indexOf(tile)];
                        }
                    });
                }
            }
        }
    });
}
function drawProjectile(projectiles, ctx) {
    ctx.fillStyle = 'black';
    projectiles.forEach((projectile) => {
        ctx.fillRect(projectile.x, projectile.y, 5, 5);
    });
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
    if (player.projectiles != null) {
        drawProjectile(player.projectiles, ctx);
    }
}
function updatePlayer(player, ground, dt) {
    player.shootTimer += dt;
    if (player.projectiles != null) {
        updateProjectile(player.projectiles, ground, dt);
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
    player.projectiles.push(new Projectile(player.x + player.size / 2, player.y + player.size / 6, player.angle, player.strenght));
    player.shootTimer = 0;
}
//# sourceMappingURL=player.js.map