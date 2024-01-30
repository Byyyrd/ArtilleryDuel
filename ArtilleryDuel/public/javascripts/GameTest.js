var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var test;
(function (test) {
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            const ws = yield connectToServer();
            const canvas = document.getElementById("gameArea");
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            var ctx = canvas.getContext("2d");
            var penGravity = 9.81;
            var penStrength = 100;
            var date = new Date();
            let previousTime = date.getTime();
            var leftPressed = false;
            var rigthPressed = false;
            var won = false;
            var lost = false;
            function inRectangle(px, py, rx, ry, rb, rh) {
                if (rx < px && px < rx + rb && ry < py && py < ry + rh) {
                    return true;
                }
                else {
                    return false;
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
                projectile.x += projectile.strength * Math.sin(projectile.angle) * dt * projectile.speed;
                projectile.y += projectile.yVel * Math.cos(projectile.angle) * dt * projectile.speed;
                projectile.yVel -= projectile.gravity * projectile.speed;
            }
            function drawProjectile(projectile) {
                ctx.fillStyle = 'black';
                ctx.fillRect(projectile.x, projectile.y, 5, 5);
            }
            class Player {
                constructor(x, y, size, color) {
                    this.dir = 0;
                    this.speed = 10;
                    this.xVel = 0;
                    this.angle = 0;
                    this.x = x;
                    this.y = y;
                    this.size = size;
                    this.color = color;
                }
            }
            function drawPlayer(player) {
                ctx.fillStyle = player.color;
                ctx.fillRect(player.x, player.y, player.size, player.size / 2);
                if (player.angle != 0) {
                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 5;
                    drawProjectilePath(player);
                }
                ctx.fillStyle = 'black';
                ctx.fillText(penGravity.toString(), 100, 100);
                ctx.fillText(penStrength.toString(), 100, 200);
                if (player.projectile != null) {
                    drawProjectile(player.projectile);
                }
            }
            function drawProjectilePath(player) {
                ctx.beginPath();
                var penX = player.x + player.size / 2;
                var penY = player.y + player.size / 4;
                var penYVel = penStrength;
                var penSpeed = .25;
                ctx.moveTo(penX, penY);
                while (penX > 0 && penX < canvas.width && penY < 725) {
                    penX += penStrength * Math.sin(player.angle) * penSpeed;
                    penY += penYVel * Math.cos(player.angle) * penSpeed;
                    penYVel -= penGravity * penSpeed;
                    ctx.lineTo(penX, penY);
                }
                ctx.stroke();
            }
            function updatePlayer(player, dt) {
                if (player.projectile != null) {
                    updateProjectile(player.projectile, dt);
                }
                movePlayer(player);
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
            function shoot(player, mouseX, mouseY) {
                player.angle = Math.atan2(mouseX - (player.x + player.size / 2), mouseY - (player.y + player.size / 4));
                player.projectile = new Projectile(player.x + player.size / 2, player.y + player.size / 4, player.angle, 100);
            }
            var player = new Player(10, 700, 50, "darkslategray");
            var player2 = new Player(500, 700, 50, "yellow");
            function update() {
                requestAnimationFrame(update);
                if (!won && !lost) {
                    date = new Date();
                    var dt = (date.getTime() - previousTime) / 60;
                    inputs();
                    draw();
                    updatePlayer(player, dt);
                    updatePlayer(player2, dt);
                    collision();
                    setTimeout(function () { }, 100);
                    const messageBody = player;
                    ws.send(JSON.stringify(messageBody));
                    previousTime = date.getTime();
                }
                else {
                    clearScreen();
                    ctx.fillStyle = "red";
                    if (won) {
                        ctx.fillText("You Win", 100, 100);
                    }
                    else if (lost) {
                        ctx.fillText("You Lose", 100, 100);
                    }
                }
            }
            function collision() {
                if (player2 != null && player2.projectile != null && !won) {
                    if (inRectangle(player2.projectile.x, player2.projectile.y, player.x, player.y, player.size, player.size / 2)) {
                        player = null;
                        lost = true;
                    }
                }
            }
            function draw() {
                clearScreen();
                //Draw Background
                ctx.fillStyle = "darkolivegreen";
                ctx.fillRect(0, 725, canvas.width, canvas.height - 725);
                //Draw Player
                drawPlayer(player);
                drawPlayer(player2);
            }
            function clearScreen() {
                ctx.fillStyle = "#2c2c2c";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            function lerp(start, end, amt) {
                return (1 - amt) * start + amt * end;
            }
            function inputs() {
                if (leftPressed) {
                    player.dir = -1;
                }
                else if (rigthPressed) {
                    player.dir = 1;
                }
                else {
                    player.dir = 0;
                }
            }
            document.body.addEventListener('keydown', keyDown);
            document.body.addEventListener('keyup', keyUp);
            canvas.addEventListener('mousedown', mouseClick);
            function keyDown(event) {
                if (event.key == 'a') {
                    leftPressed = true;
                }
                if (event.key == 'd') {
                    rigthPressed = true;
                }
                if (event.key == 'ArrowLeft') {
                    penGravity -= 0.01;
                }
                if (event.key == 'ArrowRight') {
                    penGravity += 0.01;
                }
                if (event.key == 'f') {
                    penStrength -= 1;
                }
                if (event.key == 'h') {
                    penStrength += 1;
                }
            }
            function keyUp(event) {
                if (event.keyCode == 65) {
                    leftPressed = false;
                }
                if (event.keyCode == 68) {
                    rigthPressed = false;
                }
            }
            function mouseClick(event) {
                const x = event.clientX;
                const y = event.clientY;
                if (player != null) {
                    shoot(player, x, y);
                }
            }
            ws.onmessage = (webSocketMessage) => {
                console.log(webSocketMessage.data);
                const messageBody = JSON.parse(webSocketMessage.data);
                player2 = messageBody;
                if (player2 == null) {
                    if (!lost) {
                        won = true;
                    }
                }
            };
            function connectToServer() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ws = new WebSocket('ws://192.168.178.35:7071/ws');
                    return new Promise((resolve, reject) => {
                        const timer = setInterval(() => {
                            if (ws.readyState === 1) {
                                clearInterval(timer);
                                resolve(ws);
                            }
                        }, 10);
                    });
                });
            }
            update();
        });
    })();
})(test || (test = {}));
//# sourceMappingURL=GameTest.js.map