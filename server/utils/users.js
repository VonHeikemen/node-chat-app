const addUser = (users, {id, name, room}) => {
    return users.concat([
        {
            id,
            name,
            room
        }
    ]);
};

const removeUser = (users, userId) => {
    return users.filter( user => user.id !== userId );
};

const getUser = (users, userId) => {
    return users.find( user => user.id === userId );
};

const getUserList = (users, room) => {
    return users
        .filter( user => user.room === room )
        .map( user => user.name )
    ;
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserList
};