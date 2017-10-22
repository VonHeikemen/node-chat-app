const adminMessage = {
    greeting: 'Welcome, ${username}',
    joined: '${username} has joined',
    leave: '${username} has left'
};

const generateMessage = ({from, text, opts={plain: true}}) => {
    return  {
        from,
        text,
        createdAt: new Date().getTime(),
        opts
    };
};

const sendAdminMessage = (typeMessage, username) => {
    const from = 'Admin';
    const text = adminMessage[typeMessage].replace('${username}', username);

    return generateMessage({from, text});
};

const shareUserLocation = ({from, latitude, longitude}) => {
    const text = 'My current location';
    const opts = {
        anchor: true,
        href: `https://www.google.com/maps?q=${latitude},${longitude}`
    };

    return generateMessage({from, text, opts});
};

const validateString = (text) => {
    return ( 
        typeof text === 'string'
        && text.trim() !== ''
    );
};


module.exports = {
    generateMessage,
    sendAdminMessage,
    shareUserLocation,
    validateString
};