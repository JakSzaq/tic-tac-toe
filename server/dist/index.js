"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const INDEX = '/index.html';
const app = (0, express_1.default)();
const server = app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}...`));
// socket server
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    }
});
let clientsInRoom = {};
io.on('connection', (socket) => {
    socket.on('reqTurn', (data) => {
        const room = JSON.parse(data).room;
        io.to(room).emit('playerTurn', data);
    });
    socket.on('create', room => {
        var _a;
        if (io.sockets.adapter.rooms.has(room)) {
            socket.emit('error_invalid_room_code');
        }
        else {
            console.log("NEW ROOM:" + room);
            socket.join(room);
            clientsInRoom[room] = (_a = io.sockets.adapter.rooms.get(room)) === null || _a === void 0 ? void 0 : _a.size;
        }
    });
    socket.on('join', room => {
        var _a;
        if (io.sockets.adapter.rooms.has(room)) {
            clientsInRoom[room] = (_a = io.sockets.adapter.rooms.get(room)) === null || _a === void 0 ? void 0 : _a.size;
            switch (clientsInRoom[room]) {
                case 1:
                    socket.join(room);
                    io.to(room).emit('opponent_joined');
                    break;
                case 2:
                    socket.emit('error_room_is_full');
                    break;
                default:
                    break;
            }
        }
        else {
            socket.emit('error_invalid_room_code');
        }
    });
    socket.on('reqRestart', (data) => {
        const room = JSON.parse(data).room;
        io.to(room).emit('restart');
    });
    socket.on('update', room => {
        var _a;
        var players = (_a = io.sockets.adapter.rooms.get(room)) === null || _a === void 0 ? void 0 : _a.size;
        console.log("players in room " + room + ": " + players);
        if (players === 1) {
            io.to(room).emit('pause');
        }
    });
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        io.emit("gameStatus");
    });
});
