const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.json');
const faker = require('faker');
const request = require('request-promise');
const mClient = require('../client/client.js');
const auth0Manage = new mClient(config.mClientOptions);

// I hate globals but I can't think of a better way to do this
const userIds = [];

beforeAll(async () => {
  for (let i = 0; i <= 3; i++) {
    const md = await auth0Manage.createUser({
      "name": faker.name.findName(),
      "email": faker.internet.exampleEmail(),
      "connection": "Username-Password-Authentication",
      "password": "Test1337!"
    });
    userIds.push(md.user_id);
  }

  // for CJK locale test
  const cjkMd = await auth0Manage.createUser({
    "name": "墨镜",
    "email": "面条@玉米片.com",
    "connection": "Username-Password-Authentication",
    "password": "Test1338!"
  });
  userIds.push(cjkMd.user_id);
});

afterAll(async () => {
  for (let e in userIds) {
    await auth0Manage.deleteUser({
      id: userIds[e]
    });
  }

  // alternative: NUKE THE ENTIRE SITE FROM ORBIT
  // (it's the only way to be sure)
  // await auth0Manage.deleteAllUsers();
});

describe('search results functional tests', () => {
  test('get users by email domain with wildcards', async () => {
    // faker.internet.exampleEmail() gives emails with domain example.com or example.net
    let params = {
      search_engine: config.testOptions.apiVersion,
      q: 'email:*example*'
    };

    await auth0Manage.getUsers(params).then(data => {
      expect(data.length).toBe(4);
      for (let e in data) {
        expect(data[e].email).toContain('example');
      }
    });
  });

  test('get single user by multiple fields', async () => {
    let query = 'user_id:"' + userIds[0] + '" AND email_verified:"false"';
    let params = {
      search_engine: config.testOptions.apiVersion,
      q: query
    };
    await auth0Manage.getUsers(params).then(data => {
      expect(data.length).toBe(1);
      expect(data[0].user_id).toBe(userIds[0]);
    });
  });

  test('get multiple users by multiple fields', async () => {
    let params = {
      search_engine: config.testOptions.apiVersion,
      q: 'email_verified:"false" AND email:*example*'
    };
    await auth0Manage.getUsers(params).then(data => {
      expect(data.length).toBe(4);
      for (let e in data) {
        expect(data[e].email).toContain('example');
        expect(data[e].email_verified).toBeFalsy();
      }
    })
  });

  test('get user by nested property', async () => {
    let params = {
      search_engine: config.testOptions.apiVersion,
      q: 'identities.provider:auth0'
    };

    await auth0Manage.getUsers(params).then(data => {
      expect(data.length).toBe(8);
      for (let e in data) {
        expect(data[e].identities[0].provider).toBe("auth0");
      }
    });
  });

  test('pass query that returns nothing', async () => {
    let params = {
      search_engine: config.testOptions.apiVersion,
      q: 'email:foo'
    };
    await auth0Manage.getUsers(params).then(data => {
      expect(data.length).toBe(0);
    });
  });

  test('get user by nonexistent field', async () => {
    let params = {
      search_engine: config.testOptions.apiVersion,
      q: 'for:the horde'
    };

    await expect(auth0Manage.getUsers(params)).rejects.toThrow('filter can not be used with unknown field');
  });

  test('get user with wrong api version specified', async () => {
    let params = {
      search_engine: 'v1',
      q: 'name:zelda'
    };

    await expect(auth0Manage.getUsers(params)).rejects.toThrow('You are not allowed to use search_engine=v1.');
  });

  test('get users by creation date range', async () => {
    // I wanted to use login count range but couldn't get the field onto the users
    let params = {
      search_engine: config.testOptions.apiVersion,
      q: 'created_at:[2020 TO *]'
    };

    await auth0Manage.getUsers(params).then(data => {
      expect(data.length).toBe(8);
      for (let e in data) {
        let testTime = new Date(data[e].created_at);
        let year = new Date('2020-01-01T00:00:00');

        // just checking that users were created after the beginning of the year
        // it's cheap and crufty and I'd like to refactor this
        expect(testTime > year).toBeTruthy();
      }
    });
  });

  test('it handles CJK characters', async () => {
    let params = {
      search_engine: config.testOptions.apiVersion,
      q: 'email:面条@玉米片.com'
    };

    // there's only one of these, the point is that it doesn't collapse
    await auth0Manage.getUsers(params).then(data => {
      expect(data.length).toBe(1);
      expect(data[0].email).toBe('面条@玉米片.com');
    });
  });

  test('try to send call as POST request', async () => {

    // it is the year twenty twenty and we still can't use template literals in JSON 
    let authOptions = {
      url: 'https://ph0lcidae.auth0.com/oauth/token',
      headers: {
        'content-type': 'application/json'
      },
      body: config.authOptions.queryBody,
      json: true
    };

    let authResp = await request.post(authOptions).then(data => {
      return data;
    });
    let authHeaders = 'Bearer ' + authResp.access_token;

    let testOptions = {
      url: 'https://ph0lcidae.auth0.com/api/v2/users/',
      headers: {
        authorization: authHeaders
      },
      body: {
        "q": 'email:*example*',
        "search_engine": config.testOptions.apiVersion
      },
      json: true
    };

    await request.post(testOptions).catch(e => {
      // toStrictEqual() is deep equality whereas toBe() is not
      expect(e.error).toStrictEqual({
        error: 'Not Found',
        message: 'Not Found',
        statusCode: 404
      });
    });
  });

  test('sql injection should not work', async () => {
    let params = {
      search_engine: config.testOptions.apiVersion,
      q: 'email:" or ""="'
    };
    await auth0Manage.getUsers(params).then(data => {
      // this should just return an empty response
      expect(data.length).toBe(0);
    })
  });

  test.skip('query should time out after 2 seconds', () => {
    let params = {
      search_engine: config.testOptions.apiVersion,
      q: 'email:*example*'
    };
    // TODO: unskip when I figure out how to make this work with Jest's timeouts
  });
});

describe('view search result tests', () => {

  test('view search results by page number', () => {

  });

  test('view search results by nonexistent page number', () => {

  });

  test('view search results with 0 users per page', () => {

  });

  test('view search results with 5 users per page', () => {

  });

  test('view search results with 5000 users per page', () => {

  });

  test('view search results with totals included', () => {

  });
});

describe('sort search results tests', () => {
  
  test('sort search results ascending', () => {

  });

  test('sort search results descending', () => {

  });

  test('sort by numeric field', () => {

  });

  test('sort by alphabetical field', () => {

  });

  test('sort empty search results', () => {

  });

  test('sort search results containing non-alphanumerics', () => {

  });

  test('results on same field from different endpoints should be identical when sorted', () => {

  });

  test('sort by nothing/nonsense filter', () => {

  });
});