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
const {
    addUser,
    removeUser,
    getUser,
    getUserList
} = require('./utils/users.js');

const app = express();
const server = http.Server(app);
const io = socketIO(server);
let users = [];

const port = process.env.PORT || 3000; 

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));

io.on('connect', socket => {
    console.log('A new user connected');

    socket.on('join', data => {
        const user = {
            id: socket.id,
            room: data.room,
            name: data.name
        };

        users = addUser(users, user);

        //Join the room
        socket.join(user.room);

        //emit to all users except the sender
        socket.to(user.room).emit('newMessage', userJoined('notice', user.name));

        //emit only to the user
        socket.emit('welcome', userJoined('greeting', user.name));
    });

    socket.on('createMessage', (data, callback) => {
        const user = getUser(users, socket.id);
        const message = {
            from: user.name,
            text: data.text
        }

        io.in(user.room).emit('newMessage', generateMessage(message));
        callback('Message send succesfully');
    });

    socket.on('shareLocation', (data) => {
        const user = getUser(users, socket.id);
        data.from = user.name;
        io.in(user.room).emit('newLocationUrl', shareUserLocation(data));
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