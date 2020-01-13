const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.json');
const faker = require('faker');
const request = require('request-promise');

jest.unmock('auth0');

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
      "name": faker.name.findName(),
      "email": faker.internet.exampleEmail(),
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
  for(let i in userIds) {
    await auth0Manage.deleteUser({ id: userIds[i] });
  }
  
  // alternative: NUKE THE ENTIRE SITE FROM ORBIT
  // (it's the only way to be sure)
  // await auth0Manage.deleteAllUsers();
})

test('get users by email domain with wildcards', async () => {
  // faker.internet.exampleEmail() gives emails with domain example.com or example.net
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };
  
  await auth0Manage.getUsers(params).then( data => {
    expect(data.length).toBe(2);
    for(let e in data) {
      expect(data[e].email).toContain('example');
    }
  });
})

test('get single user by multiple fields', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
  // TODO: get by email_verified and user_id
})

test('get multiple users by multiple fields', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };
  // TODO: get by email_verified and blocked
})

test('get user by nested property', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
  // TODO: get from identities property 
})

test('pass query that returns nothing', async () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:foo'
  };  
  await auth0Manage.getUsers(params).then( data => {
    expect(data.length).toBe(0);
  })
})

test('get user by nonexistent field', async () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'for:the horde'
  };
  
  await expect(auth0Manage.getUsers(params)).rejects.toThrow('filter can not be used with unknown field');
})

test('get user with wrong api version specified', async () => {
  var params = {
    search_engine: 'v1',
    q: 'name:zelda'
  };
  
  await expect(auth0Manage.getUsers(params)).rejects.toThrow('You are not allowed to use search_engine=v1.');  
})

test('get user by login range', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
  // TODO: get user with login range syntax
})

test('it handles CJK characters', async () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:面条@玉米片.com'
  };
  
  // there's only one of these, the point is that it doesn't collapse
  await auth0Manage.getUsers(params).then( data => {
    expect(data.length).toBe(1);
    expect(data[0].email).toBe('面条@玉米片.com');
  });  
})

test('try to send call as POST request', async () => {
  
//   var authBody = JSON.stringify(`{"client_id":${config.clientID},"client_secret":${config.clientSecret},"audience":${config.apiBase},"grant_type":"client_credentials"}`)
//   var authOptions = { method: 'POST',
//   url: 'https://ph0lcidae.auth0.com/oauth/token',
//   headers: { 'content-type': 'application/json' },
//   body: authBody
//   };
  
//   var authResp = await request(authOptions);
  
//   var testOptions = {
//     method: 'POST',
//     url: `${config.apiBase}`,
//     qs: {q: 'email:*example*', search_engine: config.apiVersion },
//     headers: {authorization: `Bearer ${authResp.access_token}` }
//   };
  
//   await request(testOptions).catch( e => {
//     expect(e).toBe({
//       error: "invalid json"
//     })
//   });
})

test('sql injection should not work', async () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:" or ""="'
  };
  await auth0Manage.getUsers(params).then( data => {
    // this should just return an empty response
    expect(data.length).toBe(0);
  })
})

test.skip('query should time out after 2 seconds', () => {
  var params = {
    search_engine: config.apiVersion,
    q: 'email:*example*'
  };  
  // TODO: unskip when I figure out how to make this work with Jest's timeouts
})