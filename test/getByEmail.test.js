const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.json');
const faker = require('faker');
const request = require('request-promise');
const mClient = require('../client/client.js');
const auth0Manage = new mClient(config.mClientOptions);

// I hate globals but I can't think of a better way to do this
const userIds = [];
const emails = [];
const deletedEmail = faker.internet.exampleEmail();

beforeAll( async () => {
  for(let i = 0; i <= 3; i++) {
    const md = await auth0Manage.createUser({
      "name":faker.name.findName(),
      "email":faker.internet.exampleEmail(),
      "connection": "Username-Password-Authentication",
      "password":"Test1337!"
    });
    userIds.push(md.user_id);
    emails.push(md.email);
  }
  
  const delMd = await auth0Manage.createUser({
    "name":faker.name.findName(),
    "email":deletedEmail,
    "connection": "Username-Password-Authentication",
    "password": "Test1338!"
  });
  
  await auth0Manage.deleteUser({ id: delMd.user_id });
  
// const dupeMd = await auth0Manage.createUser({
//   "name":faker.name.findName(),
//   "email":emails[0],
//   "connection": "Username-Password-Authentication",
//   "password": "Test1337Again!"
// });
// userIds.push(dupeMd.user_id);
}) 


afterAll( async () => {
  // I don't know why forEach syntax doesn't work here, but it won't pass the array element to deleteUser()
  for(let e in userIds) {
    await auth0Manage.deleteUser({ id: userIds[e] });
  }
})

test('get user by email with get by email endpoint', async () => {
  await auth0Manage.getUsersByEmail(emails[0]).then( data => {
    expect(data.length).toBe(1);
    expect(data[0].email).toBe(emails[0]);
  })    
})

test.skip('get multiple users with get by email endpoint', async () => {
  // skipped for now because unable to create duplicate email user programmatically
  await auth0Manage.getUsersByEmail(emails[1]).then( data => {
    expect(data.length).toBe(2);
    for(let e in data) {
      expect(data[e].email).toBe(emails[1]);
    }
  })   
})

test('get a nonexistent email', async () => {
  await auth0Manage.getUsersByEmail("anduin@thealliance.gov").then( data => {
    // should get an empty response
    expect(data.length).toBe(0);
  })
})

test('get an incorrectly formatted email', async () => {
  await expect(auth0Manage.getUsersByEmail("loktar@ogar")).rejects.toThrow("Object didn't pass validation for format email");
})

test('pass in a nonsense string', async () => {
  await expect(auth0Manage.getUsersByEmail("foolish nephalem")).rejects.toThrow("Object didn't pass validation for format email");
})

test('get an email from a deleted user', async () => {
  await auth0Manage.getUsersByEmail(deletedEmail).then( data => {
    // should get an empty response for deleted user
    expect(data.length).toBe(0);
  })  
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
  
  let testOptions = {
    url: 'https://ph0lcidae.auth0.com/api/v2/users-by-email/',
    headers: { authorization: authHeaders },
    body: { "email":emails[0] },
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
  let params = {
    search_engine: config.testOptions.apiVersion,
    q: 'email:" or ""="'
  };
  await auth0Manage.getUsers(params).then( data => {
    // this should just return an empty response
    expect(data.length).toBe(0);
  })   
})