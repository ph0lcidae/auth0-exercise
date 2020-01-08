# auth0-exercise
Technical exercise for Auth0's User Search API.

# Scope
This test suite exercises the Auth0 User Search API, including the get users endpoint, get users by email, and get users by ID. It also exercises viewing results by page and sorting. 
This test suite does not examine anything UI-related. Performance and load tests are mocked for the purposes of the exercise due to processing and time constraints but are included as proof of concept.

# Tools
I've used Jest as a testing framework here on top of node.js; I chose it over Mocha just due to ease of setup and running, as well as robust feature set. (It's great.)

# Setup & Running
The project depends on the node packages `jest` and `auth0`.
I will provide the config file separately.

In the project directory, run:
`npm run test` 
to run all test suites. 

For more detail, run:
`npm run test -- --verbose`

Run a specific test file with the following:
`npm run test -- -t getById`
or replace getById with the test file you wish to run.

If you'd like to run a single test case:
`npm run test -- -t "get a nonexistent id"`
or replace with the test descriptor you'd like to run. Note that this will run all the tests with such a description regardless of the file.