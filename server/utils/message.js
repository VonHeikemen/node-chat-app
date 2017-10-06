const generateMessage = ({from = 'User', text}) => {
    return  {
        from,
        text,
        createdAt: new Date().getTime()
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
    const text = `https://www.google.com/maps?q=${latitude},${longitude}`;

    return generateMessage({text});
};

module.exports = {
    generateMessage,
    userJoined,
    shareUserLocation
};