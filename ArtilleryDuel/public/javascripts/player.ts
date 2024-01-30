class Player {
    x: number;
    y: number;
    size: number;
    color: string;
    dir = 0;
    speed = 10;
    xVel = 0;
    angle = 2 * Math.PI;
    strenght = 100;
    minAngle = 3/2 * Math.PI;
    projectile: Projectile;
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
}

class Projectile {
    x: number;
    y: number;
    yVel: number;
    angle: number;
    strength: number;
    speed = .125;
    gravity = 9.81;
    constructor(x, y, angle, strength) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.strength = strength;
        this.yVel = strength;
    }
}

function updateProjectile(projectile: Projectile, dt: number) {
    projectile.x += projectile.strength * Math.cos(projectile.angle) * projectile.speed;
    projectile.y += projectile.yVel * Math.sin(projectile.angle) * projectile.speed;
    projectile.yVel -= projectile.gravity * projectile.speed;
}
function drawProjectile(projectile: Projectile,ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(projectile.x, projectile.y, 5, 5);
}



function drawPlayer(player: Player,ctx:CanvasRenderingContext2D,tankImage:HTMLImageElement) {
    ctx.fillStyle = player.color;

    ctx.drawImage(tankImage, player.x, player.y);

    //Draw Barrel
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(player.x + player.size / 2, player.y + player.size / 6)
    ctx.lineTo(player.x + player.size / 2 + Math.cos(player.angle) * 30, player.y + player.size / 6 + Math.sin(player.angle) * 30)
    ctx.stroke();

    if (player.projectile != null) {
        drawProjectile(player.projectile,ctx)
    }
}
function updatePlayer(player: Player, dt: number) {
    if (player.projectile != null) {
        updateProjectile(player.projectile, dt);
    }
    movePlayer(player);
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

function movePlayer(player: Player) {
    if (player.dir != 0) {
        player.xVel = lerp(player.xVel, player.speed * player.dir, 0.3);
    } else {
        player.xVel = lerp(player.xVel, 0, 0.5);
    }
    player.x += player.xVel;
}
/*function shoot(player: Player, mouseX, mouseY) {
    player.angle = Math.atan2(mouseX - (player.x + player.size / 2), mouseY - (player.y + player.size / 4));
    player.projectile = new Projectile(player.x + player.size / 2, player.y + player.size / 6, player.angle, 100);
}*/
function shoot(player: Player) {
    player.projectile = new Projectile(player.x + player.size / 2, player.y + player.size / 6, player.angle, player.strenght);
}

