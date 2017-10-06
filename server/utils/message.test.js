const messageUtils = require('./message');
const chai = require('chai');

const expect = chai.expect;
const { generateMessage } = messageUtils;

describe('Message Utils', () => {

    it('should return valid message object', () => {
        const from = 'One User';
        const text = 'Some awesome text';

        const message = generateMessage({from, text});

        expect(message.from).to.equal(from);
        expect(message.text).to.equal(text);
        expect(message.createdAt).to.be.a('number')

        ;
    });

});