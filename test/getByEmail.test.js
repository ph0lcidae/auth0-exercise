const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.json');
const faker = require('faker');
const request = require('request-promise');
const mClient = require('../client/client.js');
const auth0Manage = new mClient(config.mClientOptions);

// I hate globals but I can't think of a better way to do this
const userIds = [];
const emails = [];

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
  for(let i = 0; i < userIds.length; i++) {
    await auth0Manage.deleteUser({ id: userIds[i] });
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
    //expect(data.length).toBe(2);
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

test('get an email from a deleted user', () => {
  
})

test('try to send call as POST request', () => {
  
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