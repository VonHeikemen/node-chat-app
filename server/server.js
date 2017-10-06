const http = require('http');
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');

const {
    generateMessage,
    userJoined,
    shareUserLocation
} = require('./utils/message');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 3000; 

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

io.on('connect', socket => {
    console.log('A new user connected');

    socket.broadcast.emit('newMessage', userJoined('notice'));
    socket.emit('welcome', userJoined('greeting'));

    socket.on('createMessage', (data, callback) => {
        io.emit('newMessage', generateMessage(data));
        callback('Message send succesfully');
    });

    socket.on('shareLocation', (data) => {
        io.emit('newLocationUrl', shareUserLocation(data));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log('running on port', port);
});