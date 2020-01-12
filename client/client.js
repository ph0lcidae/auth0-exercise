const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.js');

var auth0Manage = new ManagementClient({
  token: config.apiToken,
  domain: config.domain,
  scope: 'read:users update:users'
});

module.exports = auth0Manage