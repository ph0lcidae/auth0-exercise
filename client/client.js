const ManagementClient = require('auth0').ManagementClient;
const config = require('../config/config.json');

function mClient(params) {
  var auth0Manage = new ManagementClient(config.mClientOptions);
  return auth0Manage;
}

module.exports = mClient