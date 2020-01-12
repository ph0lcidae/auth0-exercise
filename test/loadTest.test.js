const config = require('../config/config.json');

// using jest's auto-mocking feature; manual mocking is also available
jest.mock('auth0');

beforeAll( async () => {

})

afterAll( async () => {

})

test('it handles 5000 calls', () => {
  
})

test('it handles 50000 calls', () => {
  
})

test('it handles 500000 calls', () => {
  
})

test('it handles 5000000 calls', () => {
  
})

test('it handles a large traffic spike', () => {
  
})

test('performance does not degrade past 10ms per 500 calls', () => {
  // these numbers are arbitrary for the sake of demonstration
})