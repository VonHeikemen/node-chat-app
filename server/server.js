const http = require('http');
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var port = process.env.PORT || 3000; 

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

io.on('connect', socket => {
    console.log('A new user connected');

    socket.on('createMessage', (data) => {
        console.log('Data from client:', data);
        
        data.createdAt = new Date().toString();
        socket.emit('newMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log('running on port', port);
});