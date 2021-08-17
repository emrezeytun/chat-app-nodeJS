const express = require('express');
const socket = require('socket.io');
const path = require('path');

const getUsers = require('./getUsers');




const app = express();

const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')))

const server = app.listen(port, () => {
    console.log('server is listening');
})


var io = socket(server);

io.on('connection', (socket) => {
    
    socket.on('joinRoom', (data) => {
       const users = getUsers(socket.id,data.userName, data.roomName);



       let roomName = data.roomName
        let username = data.userName

        socket.join(roomName);

        socket.emit('onlineUsers', users);

        socket.on('users', function(data) {
            io.sockets.emit('getUsers', data);
        })

        socket.on('chatMsg', function(data) {
            io.sockets.to(roomName).emit('getMsg', data);
        });
    
        socket.on('typing', function(data) {
            io.sockets.to(roomName).emit('typingPrint', data);
        });

        
        socket.emit('getMsg', {user: 'Admin', message: `Welcome ${username}`});
        socket.broadcast.to(roomName).emit('getMsg', {user: 'Admin', message: `${username} has joined the room.`});

        
        socket.on('disconnect', () => {
            socket.broadcast.to(roomName).emit('getMsg', {user: 'Admin', message: `${username} has left the room.`});
        })

    })

 
})
