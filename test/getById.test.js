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
});

afterAll( async () => {
  for(let e in userIds) {
    await auth0Manage.deleteUser({ id: userIds[e] });
  }
});

test('get a single user by id', async () => {
  await auth0Manage.getUser(userIds[0]).then( data => {
    expect(data.length).toBe(1);
    expect(data[0].user_id).toBe(userIds[0]);
  });    
});

test('get a string that is not an id', async () => {
  await auth0Manage.getUser("remember the sunwell").then( data => {
    // should return all users in tenant
    expect(data.length).toBe(5);
  });
});

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
});

test('malicious code injection should not work', async () => {
  await auth0Manage.getUser(userIds[0]+' ; alert("oh hai");').then( data => {
    // this should also just return all users in the tenant
    expect(data.length).toBe(5);
  });  
});