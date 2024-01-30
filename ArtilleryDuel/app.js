"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const WebSocket = require("ws");
const index_1 = require("./routes/index");
const game_1 = require("./routes/game");
const debug = require('debug')('my express app');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/game', game_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();
let player1Id = '';
let player2Id = '';
wss.on('connection', (ws) => {
    const id = uuidv4();
    clients.set(ws, id);
    ws.on('message', (messageAsString) => {
        if (clients.get(ws) != player1Id && clients.get(ws) != player2Id) {
            join(ws);
        }
        const message = JSON.parse(messageAsString);
        const id = clients.get(ws);
        if (message != null) {
            message.sender = id;
        }
        const outbound = JSON.stringify(message);
        [...clients.keys()].forEach((client) => {
            if (clients.get(client) != id) {
                client.send(outbound);
            }
        });
    });
    ws.on("close", () => {
        if (clients.get(ws) === player1Id) {
            player1Id = '';
        }
        if (clients.get(ws) === player2Id) {
            player2Id = '';
        }
        clients.delete(ws);
    });
    join(ws);
});
function join(ws) {
    if (player1Id === '') {
        player1Id = clients.get(ws);
        console.log("Player1 Connected");
        const message = "{ \"dir\": 0, \"speed\": 10, \"xVel\": 0, \"angle\": 6.28318530718, \"strenght\": 100,\"minAngle\": 4.71238898038, \"x\": 50, \"y\": 700, \"size\": 64, \"color\": \"darkslategray\", \"sender\": \"server\" }";
        ws.send(message);
    }
    else if (player2Id === '') {
        player2Id = clients.get(ws);
        console.log("Player2 Connected");
        const message = "{ \"dir\": 0, \"speed\": 10, \"xVel\": 0, \"angle\": 3.14159265359, \"strenght\": 100,\"minAngle\": 3.14159265359, \"x\": 800, \"y\": 700, \"size\": 64, \"color\": \"darkslategray\", \"sender\": \"server\" }";
        ws.send(message);
    }
}
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), function () {
    debug(`Express server listening on port ${server.address().port}`);
});
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
console.log("wss up");
//# sourceMappingURL=app.js.map