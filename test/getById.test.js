const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.json');
const faker = require('faker');
const request = require('request-promise');
const mClient = require('../client/client.js');
const auth0Manage = new mClient(config.mClientOptions);

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
    await auth0Manage.deleteUser({ id: userIds[i] });
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

test('sql injection should not work', async () => {
  await auth0Manage.getUsersById(userIds[0]+'" or ""="').then( data => {
    // this should just return an empty response
    expect(data.length).toBe(0);
  })  
})

test('get by a field that is not id', () => {
  
})