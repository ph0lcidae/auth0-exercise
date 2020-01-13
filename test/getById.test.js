const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.json');
const faker = require('faker');

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
      "name":faker.name.findName(),
      "email":faker.internet.exampleEmail(),
      "connection": "Username-Password-Authentication",
      "password":"Test1337!"
    });
    userIds.push(md.user_id);
  }
})

afterAll( async () => {
  // I don't know why forEach syntax doesn't work here, but it won't pass the array element to deleteUser()
  for(let i = 0; i < userIds.length; i++) {
    await auth0Manage.deleteUser({ id: userIds[i]});
  }
})

test('get user by email with get by id endpoint', () => {
  
})

test('get multiple users with get by id endpoint', () => {
  
})

test('get a nonexistent id', () => {
  
})

test('get an incorrectly formatted id', () => {
  
})

test('get an id from a deleted user', () => {
  
})

test('try to send call as POST request', () => {
  
})

test('sql injection should not work', () => {
  
})

test('get by a field that is not id', () => {
  
})