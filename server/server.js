const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const socketIO = require('socket.io');

const {
    generateMessage,
    sendAdminMessage,
    shareUserLocation,
    validateString
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

    socket.on('join', (data, callback) => {
        const user = {
            id: socket.id,
            room: data.room,
            name: data.name
        };

        if( !validateString(user.name)
            || !validateString(user.room) 
        ){
            return callback({error: 'No room name or user name provided'});
        }

        users = addUser(users, user);

        //Join the room
        socket.join(user.room);

        //emit to all users except the sender
        socket.to(user.room).emit('newMessage', sendAdminMessage('joined', user.name));

        //emit only to the user
        socket.emit('welcome', sendAdminMessage('greeting', user.name));

        //send users list to all users
        io.in(user.room).emit('updateUserList', getUserList(users, user.room));
        callback({success: 'Welcome to the chat room'});
    });

    socket.on('createMessage', (data, callback) => {
        const user = getUser(users, socket.id);

        if( typeof user === 'undefined' )
            return callback({error: 'You must log in', noUser: true});

        if( !validateString(data.text) )
            return callback({error:'Please send a valid message'});

        const message = {
            from: user.name,
            text: data.text
        }

        io.in(user.room).emit('newMessage', generateMessage(message));
        callback({succes:'Message send succesfully'});
    });

    socket.on('shareLocation', (data, callback) => {
        const user = getUser(users, socket.id);

        if( typeof user === 'undefined' )
            return callback({error: 'You must log in', noUser: true});

        data.from = user.name;
        io.in(user.room).emit('newLocationUrl', shareUserLocation(data));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        const user = getUser(users, socket.id);

        if(typeof user === 'undefined')
            return;

        users = removeUser(users, user.id);

        socket.to(user.room).emit('newMessage', sendAdminMessage('leave', user.name));
        io.in(user.room).emit('updateUserList', getUserList(users, user.room));
    });
});

app.get('/', (req, res) => {
    res.sendFile( publicPath + '/chat.html' );
});

server.listen(port, () => {
    console.log('running on port', port);
});