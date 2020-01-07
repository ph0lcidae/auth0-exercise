var ManagementClient = require('auth0').ManagementClient;
var config = require('../config/config.js');

var management = new ManagementClient({
  token: config.apiToken,
  domain: config.domain,
  scope: 'read:users update:users'
});

module.exports = management