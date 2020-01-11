const auth0 = require('auth0-js');
const config = require('../config/config.js');

const auth0Manage = new auth0.Management({
  token: config.apiToken,
  domain: config.domain,
  scope: 'read:users update:users'
});

module.exports = auth0Manage