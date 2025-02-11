namespace test {
    (async function () {
        const ws = await connectToServer();
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("gameArea");
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        let tankImage: HTMLImageElement = <HTMLImageElement>document.getElementById("tankImage");

        let shootAudio: HTMLAudioElement = <HTMLAudioElement>document.getElementById("tankAudio");

        let date = new Date();
        let previousTime = date.getTime();

        let leftPressed = false;
        let rigthPressed = false;

        let won = false;
        let lost = false;

        let ground: GroundTile[] = [];
        const tileWidth = 10;
        const tileHeight = 10;


        for (var i = 0; i < canvas.width/tileWidth + 1; i++) {
            for (var j = 0; j < (canvas.height-720)/tileHeight + 1; j++) {
                ground.push(new GroundTile(i*tileWidth,j*tileHeight+732,tileWidth,tileHeight))
            }
        }

        

        function inRectangle(px, py, rx, ry, rb, rh) {
            if (rx < px && px < rx + rb && ry < py && py < ry + rh) {
                return true;
            } else {
                return false;
            }
        }

        var player: Player = new Player(10, 700, 64, "darkslategray");
        var player2: Player = new Player(-100, 700, 64, "yellow");

        
            

        function update() {
            requestAnimationFrame(update);
            if (!won && !lost) {
                //Calc dt
                date = new Date();
                var dt = (date.getTime() - previousTime) * 0.001;
                //inputs();

                draw();

                if (player != null) {
                    updatePlayer(player, ground, dt);
                }
                if (player2 != null) {
                    updatePlayer(player2,ground, dt);
                }

                collision();

                setTimeout(function () { }, 100);

                //Send Info to other Player
                const messageBody = player;
                ws.send(JSON.stringify(messageBody));

                //Calc dt
                date = new Date();
                previousTime = date.getTime();
            } else {

                //Draw End Screen
                clearScreen();
                ctx.fillStyle = "red";
                ctx.font = "300px Arial";
                if (won) {
                    ctx.fillText("You Win", 200, 600);
                }
                else if (lost) {
                    ctx.fillText("You Lose", 100, 600);
                }
            }

        }

        function collision() {
            if (player2 != null && player2.projectiles != null && !won) {
                player2.projectiles.forEach((projectile) => {
                    if (inRectangle(projectile.x, projectile.y, player.x, player.y, player.size, player.size / 2)) {
                        player = null;
                        lost = true;
                    }
                });
                
            }

        }

        function draw() {

            clearScreen();

            drawBackground();

            //Draw Player
            drawPlayer(player,ctx,tankImage);
            drawPlayer(player2,ctx,tankImage);

        }

        function drawBackground() {
            ctx.fillStyle = "darkolivegreen"
            //ctx.fillRect(0, 732, canvas.width, canvas.height - 732);

            ground.forEach((tile: GroundTile) => {
                ctx.fillStyle = "darkolivegreen"
                ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
                /*ctx.fillStyle = 'black';
                ctx.lineWidth = .25;
                ctx.strokeRect(tile.x, tile.y, tile.width, tile.height);*/
            });
        }

        function clearScreen() {
            ctx.fillStyle = "#2c2c2c";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function inputs() {
            if (leftPressed) {
                player.dir = -1;
            } else if (rigthPressed) {
                player.dir = 1;
            } else {
                player.dir = 0;
            }
        }

        document.body.addEventListener('keydown', keyDown);
        document.body.addEventListener('keyup', keyUp);
        canvas.addEventListener('mousedown', mouseClick);

        function keyDown(event: KeyboardEvent) {
            if (event.key == 'a') {
                leftPressed = true;
            }
            if (event.key == 'd') {
                rigthPressed = true;
            }
            if (event.key == 'ArrowUp') {
                player.strenght++;
            }
            if (event.key == 'ArrowDown') {
                player.strenght--;
            }
            if (event.key == 'ArrowLeft') {
                if(player.angle > player.minAngle)
                    player.angle -= (2 * Math.PI) / 360;
            }
            if (event.key == 'ArrowRight') {
                if(player.angle < player.minAngle + Math.PI/2)
                    player.angle += (2 * Math.PI) / 360;
            }
            if (event.key == 'Enter' && player != null) {
                if (player.shootTimer > player.shootSpeed) {
                    shootAudio.play();
                    shoot(player);
                }
            }
        }
        function keyUp(event: KeyboardEvent) {
            if (event.key == 'a') {
                leftPressed = false;
            }
            if (event.key == 'd') {
                rigthPressed = false;
            }

        }

        function mouseClick(event: MouseEvent) {
            const x = event.clientX;
            const y = event.clientY;
        }

        ws.onmessage = (webSocketMessage) => {
            const messageBody = JSON.parse(webSocketMessage.data);
            if (messageBody != null && messageBody.sender == 'server') {
                player = messageBody;
            } else {
                player2 = messageBody;
                if (player2 == null) {
                    if (!lost) {
                        won = true;
                    }

                }
            }
            
        };

        async function connectToServer(): Promise<WebSocket> {
            const ws = new WebSocket('ws://192.168.178.35:7071/ws');
            return new Promise((resolve, reject) => {
                const timer = setInterval(() => {
                    if (ws.readyState === 1) {
                        clearInterval(timer);
                        resolve(ws);
                    }
                }, 10);
            });
        }


        update();
    })();
}


