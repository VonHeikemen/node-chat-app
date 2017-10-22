const messageUtils = require('./message');
const chai = require('chai');

const expect = chai.expect;
const { 
    generateMessage,
    shareUserLocation,
    validateString
} = messageUtils;

describe('Message Utils', () => {

    it('should return valid message object', () => {
        const from = 'One User';
        const text = 'Some awesome text';

        const message = generateMessage({from, text});

        expect(message.from).to.equal(from);
        expect(message.text).to.equal(text);
        expect(message.createdAt).to.be.a('number');
    });

    it('should return correct url with coordenates', () => {
        const coords = {
            latitude: 1,
            longitude: 1
        };

        const expectedURL = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
        
        const message = shareUserLocation(coords);

        expect(message.opts)
            .to.eql({ 
                anchor: true, 
                href: expectedURL
            })
        ;
    });

    it('should return false on empty string', () => {
        expect('').to.not.satisfy(validateString);
        expect('  ').to.not.satisfy(validateString);
        expect('  d').to.satisfy(validateString);
    });

});