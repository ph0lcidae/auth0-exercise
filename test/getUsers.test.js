const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.js');
var auth0Manage = new ManagementClient({
  token: config.apiToken,
  domain: config.domain,
  scope: 'read:users update:users'
});

beforeAll(() => {
})

test('get users by email domain with wildcards', () => {
  var params = {
    search_engine: 'v3',
    q: 'email:*hyrule*'
  };
  auth0Manage.getUsers(params).then(data => expect(data.length).toBe(3));
})

test('get user by multiple fields', () => {
  
})

test('get user by nested property', () => {
  
})

test('pass query that returns nothing', () => {
  
})

test('get user by nonexistent field', () => {
  
})

test('get users by single field', () => {
  
})

test('get users by multiple fields', () => {
  
})

test('get user with wrong api version specified', () => {
  
})

test('get user by creation date range', () => {
  
})

test('try to send call as POST request', () => {
  
})

test('sql injection should not work', () => {
  
})

test('get user that was deleted and recreated', () => {
  
})

test('query should time out after 2 seconds', () => {
  
})