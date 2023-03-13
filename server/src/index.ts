import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config()

const PORT = process.env.PORT || 5000;
const INDEX = '/index.html';

const app: Express = express()

const server = app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}...`));

// socket server

import { Server, Socket } from 'socket.io';

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
      }
});

let clientsInRoom = {};

io.on('connection', (socket: Socket) => {
    
    socket.on('reqTurn', (data) => {
        const room = JSON.parse(data).room;
        io.to(room).emit('playerTurn', data);
    })

    socket.on('create', room => {
        if (io.sockets.adapter.rooms.has(room)){
            socket.emit('error_invalid_room_code'); 
        } else {
            console.log("NEW ROOM:" + room)
            socket.join(room);
            clientsInRoom[room] = io.sockets.adapter.rooms.get(room)?.size;
        }
    })

    socket.on('join', room => {
        if (io.sockets.adapter.rooms.has(room)){
            clientsInRoom[room] = io.sockets.adapter.rooms.get(room)?.size
            switch (clientsInRoom[room]){
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
        } else {
            socket.emit('error_invalid_room_code'); 
        }
    })

    socket.on('reqRestart', (data) => {
        const room = JSON.parse(data).room;
        io.to(room).emit('restart');
    })

    socket.on('update', room => {
        var players = io.sockets.adapter.rooms.get(room)?.size;
        console.log("players in room "+ room +": " + players)
        if (players === 1){
            io.to(room).emit('pause');
        }
    })
    
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        io.emit("gameStatus");
    })
});