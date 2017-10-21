const generateMessage = ({from = 'User', text, opts={plain: true}}) => {
    return  {
        from,
        text,
        createdAt: new Date().getTime(),
        opts
    };
};

const userJoined = (typeMessage, username) => {
    const from = 'Admin';
    const text = {
        greeting: `Welcome, ${username}!`,
        notice: `${username} has joined`
    };

    return generateMessage({from, text: text[typeMessage]});
};

const shareUserLocation = ({from, latitude, longitude}) => {
    const text = 'My current location';
    const opts = {
        anchor: true,
        href: `https://www.google.com/maps?q=${latitude},${longitude}`
    };

    return generateMessage({from, text, opts});
};

module.exports = {
    generateMessage,
    userJoined,
    shareUserLocation
};