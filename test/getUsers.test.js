const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.json');

var auth0Manage = new ManagementClient({
  domain: config.domain,
  clientId: config.clientID,
  clientSecret: config.clientSecret,
  scope: config.scope,
  audience: config.apiBase,
  tokenProvider: {
    enableCache: true,
    cacheTTLInSeconds: 10
  }
});

// I hate globals but I can't think of a better way to do this
var userIds = [];

beforeAll( async () => {
  for(let i = 0; i <= 1; i++) {
    const md = await auth0Manage.createUser({
      "name":"test"+i,
      "email":"test"+i+"@test.not",
      "connection": "Username-Password-Authentication",
      "password":"Test1337!"
    });
    userIds.push(md.user_id);
  }
})

afterAll( async () => {
  // I don't know why forEach syntax doesn't work here, but it won't pass the array element to deleteUser()
  for(let i = 0; i < userIds.length; i++) {
    const ret = await auth0Manage.deleteUser({ id: userIds[i]});
  }
})

test('get users by email domain with wildcards', async () => {
  var params = {
    search_engine: 'v3',
    q: 'email:*test.not*'
  };
  const ret = await auth0Manage.getUsers(params);
  expect(ret.length).toBe(2);
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