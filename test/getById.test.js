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
    console.log(md);
  }
})

afterAll( async () => {
  // I don't know why forEach syntax doesn't work here, but it won't pass the array element to deleteUser()
  for(let e in userIds) {
    await auth0Manage.deleteUser({ id: userIds[e] });
  }
})

test('get a single user by id', async () => {
  await auth0Manage.getUser(userIds[0]).then( data => {
    console.log(userIds[0]);
    expect(data.length).toBe(1);
    expect(data[0].user_id).toBe(userIds[0]);
  })    
})

test('get a non-id', async () => {
  await auth0Manage.getUser().then( data => {
    console.log(data);
    expect(data.length).toBe(0);
  })
})

test('get an incorrectly formatted id', () => {
  
})

test('try to send call as POST request', async () => {
  
  let authOptions = {
    url: 'https://ph0lcidae.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: config.authOptions.queryBody,
    json: true
  };
  
  let authResp = await request.post(authOptions).then( data => {
    return data;
  });
  let authHeaders = 'Bearer ' + authResp.access_token;
  
  let idEndpointUrl = 'https://ph0lcidae.auth0.com/api/v2/users/' + userIds[0]
  let testOptions = {
    url: idEndpointUrl,
    headers: { authorization: authHeaders },
    body: { "id":userIds[0] },
    json: true
  };
  
  await request.post(testOptions).catch( e => {
    // toStrictEqual() is deep equality whereas toBe() is not
    expect(e.error).toStrictEqual({
      error: 'Not Found',
      message: 'Not Found',
      statusCode: 404
    });
  });  
})

test('sql injection should not work', async () => {
  await auth0Manage.getUser(userIds[0]+'" or ""="').then( data => {
    // this should just return an empty response
    expect(data.length).toBe(0);
  })  
})