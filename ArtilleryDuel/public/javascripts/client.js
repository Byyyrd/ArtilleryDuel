var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const ws = yield connectToServer();
        ws.onmessage = (webSocketMessage) => {
            const messageBody = JSON.parse(webSocketMessage.data);
            const cursor = getOrCreateCursorFor(messageBody);
            cursor.style.transform = `translate(${messageBody.x}px, ${messageBody.y}px)`;
        };
        document.body.onmousemove = (evt) => {
            const messageBody = { x: evt.clientX, y: evt.clientY };
            ws.send(JSON.stringify(messageBody));
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
        function getOrCreateCursorFor(messageBody) {
            const sender = messageBody.sender;
            const existing = document.querySelector(`[data-sender='${sender}']`);
            if (existing) {
                return existing;
            }
            const template = document.getElementById('cursor');
            const cursor = template.content.firstElementChild.cloneNode(true);
            const svgPath = cursor.getElementsByTagName('path')[0];
            cursor.setAttribute("data-sender", sender);
            svgPath.setAttribute('fill', `hsl(${messageBody.color}, 50%, 50%)`);
            document.body.appendChild(cursor);
            return cursor;
        }
    });
})();
//# sourceMappingURL=client.js.map