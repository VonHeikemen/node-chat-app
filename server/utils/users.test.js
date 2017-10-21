const chai = require('chai');
const expect = chai.expect;

const {
    addUser,
    removeUser,
    getUser,
    getUserList
} = require('./users');

describe('Users Utils', () => {
    let users;

    beforeEach(() => {
        users = [{
            id: '1',
            name: 'SomeUser1',
            room: 'SomeRoom'
        },{
            id: '2',
            name: 'SomeUser2',
            room: 'OtherRoom'
        },{
            id: '3',
            name: 'SomeUser3',
            room: 'SomeRoom'
        }];
    });

    it('should add new user', () => {
        const newUser = {
            id: '123',
            name: 'SomeUser',
            room: 'SomeRoom'
        };

        users = addUser(users, newUser);

        expect(users).to.have.lengthOf(4);
        expect(users[3]).to.eql(newUser);
    });

    it('should return users from the same room', () => {
        const filteredUsers = getUserList(users, 'SomeRoom');

        expect(filteredUsers)
            .to.be.an('array')
            .of.length(2)
            .and.eql([users[0].name, users[2].name])
        ;
    });

    it('should find user', () => {
        const user = getUser(users, '1');

        expect(user).to.eql(users[0]);
    });

    it('should not find user', () => {
        const user = getUser(users, '133');

        expect(user).to.be.undefined;
    });

    it('should remove user', () => {
        const userRemoved = getUser(users, '1');
        users = removeUser(users, '1');

        expect(users)
            .to.be.an('array')
            .to.have.lengthOf(2)
            .to.not.include(userRemoved)
        ;
    });

    it('should not remove user', () => {
        users = removeUser(users, '44');

        expect(users).to.have.lengthOf(3);
    });

});