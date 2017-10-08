var socket = io();

function sendMessage (e){
    e.preventDefault();
    var text = document.getElementById('msg-body');

    var message = {
        text: text.value,
    };

    socket.emit('createMessage', message, function (resp) {
        console.log(resp);
        text.value = '';
    });
}

function renderMessage(response) {
    var messageData = {
        from: response.from,
        text: response.text,
        createdAt: messageTimestamp(response.createdAt),
        opts: response.opts
    };

    var template = document.getElementById('message-template').innerHTML;
    var message = Mustache.render(template, messageData);

    var list = document.getElementById('messages');
    list.innerHTML += message;

    scrollToBottom(list);
}

function messageTimestamp(date) {
    var options = {
        hour: 'numeric', minute: 'numeric',
        hour12: true
      };
      
      return new Intl.DateTimeFormat(['en-US'], options)
        .format(date)
        .toLocaleLowerCase();
}

function sendLocation(e) {
    if(!navigator.geolocation)
        return alert('Browser not supported');

    var btnShareLocation = this;

    btnShareLocation.innerText = 'Sending...';
    btnShareLocation.setAttribute('disabled', 'disabled')
    
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            socket.emit('shareLocation', coords);
            btnShareLocation.innerText = 'Send Location';
            btnShareLocation.removeAttribute('disabled');
        },
        function () {
            btnShareLocation.innerText = 'Send Location';
            btnShareLocation.removeAttribute('disabled');
            alert('Unable to fetch location');
        }
    );
}

function scrollToBottom(list) {
    var listTotalHeight = list.scrollHeight;
    var listVisiblePortion = list.clientHeight;

    if(listTotalHeight <= listVisiblePortion)
        return;

    var addedItem = list.lastElementChild;
    var lastItem = addedItem.previousElementSibling;

    var pixelsFromTop = list.scrollTop;
    var addedItemHeight = addedItem.clientHeight;
    var lastItemHeight = lastItem.clientHeight;

    var total =  listVisiblePortion + pixelsFromTop + addedItemHeight + lastItemHeight;

    if( total >= listTotalHeight )
        list.scrollTop = listTotalHeight;
}

document.getElementById('message-form').addEventListener('submit', sendMessage);
document.getElementById('send-location').addEventListener('click', sendLocation);

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('newMessage', renderMessage);
socket.on('welcome', renderMessage);
socket.on('newLocationUrl', renderMessage);

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});