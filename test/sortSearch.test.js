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
    await auth0Manage.deleteUser({ id: userIds[i]});
  }
})

test('sort search results ascending', () => {
  
})

test('sort search results descending', () => {
  
})

test('sort by numeric field', () => {
  
})

test('sort by alphabetical field', () => {
  
})

test('sort empty search results', () => {
  
})

test('sort search results containing non-alphanumerics', () => {
  
})

test('results on same field from different endpoints should be identical when sorted', () => {
  
})

test('sort by nothing/nonsense filter', () => {
  
})

test('sql injection should not work', () => {
  
})