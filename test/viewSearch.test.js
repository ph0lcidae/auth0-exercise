const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.json');
const faker = require('faker');

var auth0Manage = new mClient(config.mClientOptions);

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

test('view search results by page number', () => {
  
})

test('view search results by nonexistent page number', () => {
  
})

test('view search results with 0 users per page', () => {
  
})

test('view search results with 5 users per page', () => {
  
})

test('view search results with 5000 users per page', () => {
  
})

test('view search results with totals included', () => {
  
})