const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
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
app.use(bodyParser.urlencoded({ extended: false }));

io.on('connect', socket => {
    console.log('A new user connected');

    socket.on('join', data => {
        socket.join(data.room);

        //Don't do this in production, please
        //it's just wrong
        socket.username = data.name;
        socket.room = data.room;

        //emit to all users except the sender
        socket.to(socket.room).emit('newMessage', userJoined('notice', data));

        //emit only to the user
        socket.emit('welcome', userJoined('greeting', data));
    });

    socket.on('createMessage', (data, callback) => {
        const message = {
            from: socket.username,
            text: data.text
        }

        io.in(socket.room).emit('newMessage', generateMessage(message));
        callback('Message send succesfully');
    });

    socket.on('shareLocation', (data) => {
        data.from = socket.username;
        io.in(socket.room).emit('newLocationUrl', shareUserLocation(data));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile( publicPath + '/chat.html' );
});

server.listen(port, () => {
    console.log('running on port', port);
});