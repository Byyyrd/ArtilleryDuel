var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var duel;
(function (duel) {
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            const ws = yield connectToServer();
            const canvas = document.getElementById("gameArea");
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            var ctx = canvas.getContext("2d");
            var x = 100;
            var y = 100;
            var xVel = 0;
            var dir = 0;
            var speed = 10;
            var x2 = 0;
            var y2 = 0;
            var leftPressed = false;
            var rigthPressed = false;
            function loop() {
                requestAnimationFrame(loop);
                clearScreen();
                inputs();
                move();
                ctx.fillStyle = 'green';
                ctx.fillRect(x, y, 100, 100);
                ctx.fillRect(x2, y2, 100, 100);
                const messageBody = { x: x, y: y };
                ws.send(JSON.stringify(messageBody));
            }
            function clearScreen() {
                ctx.fillStyle = "#2c2c2c";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            function lerp(start, end, amt) {
                return (1 - amt) * start + amt * end;
            }
            function move() {
                if (dir != 0) {
                    xVel = lerp(xVel, speed * dir, 0.3);
                }
                else {
                    xVel = lerp(xVel, 0, 0.5);
                }
                x += xVel;
            }
            function inputs() {
                if (leftPressed) {
                    dir = -1;
                }
                else if (rigthPressed) {
                    dir = 1;
                }
                else {
                    dir = 0;
                }
            }
            document.body.addEventListener('keydown', down);
            document.body.addEventListener('keyup', up);
            function down(event) {
                if (event.key == 'a') {
                    leftPressed = true;
                }
                if (event.key == 'd') {
                    rigthPressed = true;
                }
            }
            function up(event) {
                if (event.key == 'a') {
                    leftPressed = false;
                }
                if (event.key == 'd') {
                    rigthPressed = false;
                }
            }
            ws.onmessage = (webSocketMessage) => {
                const messageBody = JSON.parse(webSocketMessage.data);
                x2 = messageBody.x;
                y2 = messageBody.y;
                console.log(`X: ${messageBody.x} Y: ${messageBody.y}`);
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
            loop();
        });
    })();
})(duel || (duel = {}));
//# sourceMappingURL=duel.js.map