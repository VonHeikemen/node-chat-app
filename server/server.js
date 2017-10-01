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

function messageHTML(message) {
    var html = `<div>
        <p>From: ${message.from}</p>
        <p>Date: ${message.createdAt}</p>
        <p>Message: ${message.text} </p>
    </div>`;

    return html;
}

function userJoined(typeMessage){
    var text = {
        greeting: 'Welcome!',
        notice: 'A new user has joined'
    };
    
    var msg = {
        from: 'Admin',
        text: text[typeMessage],
        createdAt: new Date().toString()
    };

    return messageHTML(msg);
}

io.on('connect', socket => {
    console.log('A new user connected');

    socket.broadcast.emit('newMessage', userJoined('notice'));
    socket.emit('welcome', userJoined('greeting'));

    socket.on('createMessage', (data) => {
        console.log('Data from client:', data);

        data.createdAt = new Date().toString();
        io.emit('newMessage', messageHTML(data));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log('running on port', port);
});