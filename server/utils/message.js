const generateMessage = ({from = 'User', text, opts={plain: true}}) => {
    return  {
        from,
        text,
        createdAt: new Date().getTime(),
        opts
    };
};

const userJoined = (typeMessage) => {
    const from = 'Admin';
    const text = {
        greeting: 'Welcome!',
        notice: 'A new user has joined'
    };

    return generateMessage({from, text: text[typeMessage]});
};

const shareUserLocation = ({latitude, longitude}) => {
    const text = 'My current location';
    const opts = {
        anchor: true,
        href: `https://www.google.com/maps?q=${latitude},${longitude}`
    };

    return generateMessage({text, opts});
};

module.exports = {
    generateMessage,
    userJoined,
    shareUserLocation
};