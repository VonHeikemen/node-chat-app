var socket = io();

function sendMessage (){
    var text = document.getElementById('message');
    var from = document.getElementById('from');

    var message = {
        text: text.value,
        from: from.value,
    };

    console.log(message);

    text.value = '';
    from.value = '';

    socket.emit('createMessage', message);
};

document.getElementsByTagName('button')[0].addEventListener('click', sendMessage);

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('newMessage', function(data) {
    var list = document.getElementById('list');
    var newItem = document.createElement('li');
    newItem.innerHTML = 
    "<div>" +
        "<p>From: " + data.from + "</p>" +
        "<p>Date: " + data.createdAt + "</p>" +
        "<p>Message: "+ data.text + "</p>" +
    "</div>";

    list.appendChild(newItem);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});