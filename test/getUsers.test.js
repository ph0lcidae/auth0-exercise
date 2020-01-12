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
  for(let i = 0; i <= 9; i++) {
    const md = await auth0Manage.createUser({
      "name":faker.name.findName(),
      "email":faker.internet.exampleEmail(),
      "connection": "Username-Password-Authentication",
      "password":"Test1337!"
    });
    userIds.push(md.user_id);
  }
  
  // for CJK locale test
  const cjkMd = await auth0Manage.createUser({
    "name":"墨镜",
    "email":"面条@玉米片.com",
    "connection": "Username-Password-Authentication",
    "password":"Test1338!"
  });
  userIds.push(cjkMd.user_id);
})

afterAll( async () => {
  // I don't know why forEach syntax doesn't work here, but it won't pass the array element to deleteUser()
  for(let i = 0; i < userIds.length; i++) {
    await auth0Manage.deleteUser({ id: userIds[i]});
  }
})

test('get users by email domain with wildcards', async () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };
  
  await auth0Manage.getUsers(params).then( data => {
    expect(data.length).toBe(10);
  });
})

test('get user by multiple fields', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})

test('get user by nested property', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})

test('pass query that returns nothing', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})

test('get user by nonexistent field', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})

test('get users by single field', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})

test('get users by multiple fields', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})

test('get user with wrong api version specified', async () => {
  var params = {
    search_engine: 'v1',
    q: 'name:zelda'
  };
  await expect(auth0Manage.getUsers(params)).rejects.toThrow('You are not allowed to use search_engine=v1.');  
})

test('get user by creation date range', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})

test('it handles CJK characters', async () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:面条@玉米片.com'
  };
  
  // there's only one of these, the point is that it doesn't collapse
  await auth0Manage.getUsers(params).then( data => {
    expect(data.length).toBe(1);
  });  
})

test('try to send call as POST request', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})

test('sql injection should not work', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})

test('get user that was deleted and recreated', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})

test('query should time out after 2 seconds', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
})