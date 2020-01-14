# auth0-exercise
Technical exercise for Auth0's User Search API.

# Scope
This test suite exercises the Auth0 User Search API, including the get users endpoint, get users by email, and get users by ID. It also exercises viewing results by page and sorting. 
This test suite does not examine anything UI-related. Artillery perf/load tests are mocked for the purposes of the exercise due to processing and time constraints but are included as proof of concept.
Export is excluded for lack of computing resources (my IDE and test env are running in a Docker container). Soak testing is also excluded due to lack of time (Jest has unfortunately not implemented a time machine yet).

# Tools
I've used Jest as a testing framework here on top of node.js; I chose it over Mocha just due to ease of setup and running, as well as robust feature set. (It's great.)

# Setup & Running
The project depends on the node packages `jest`, `auth0`, `auth0-js`, `faker`, `request-promise`, and `request`. 
`artillery` and `artillery-plugin-expect` are also included but not required to run Jest tests, however both are required to run Artillery tests.
An example config is provided; I will provide the real config separately.

In the project directory, run:
`npm run test -- -i --testTimeout 10000` 
to run all test suites. 

`jest.config.js` specifies running verbosely by default, however if you would prefer not to have that, just remove it from the config.

For more detail manually, run:
`npm run test -- -i --verbose --testTimeout 10000`

Run a specific test file with the following:
`npm run test -- getById --testTimeout 10000`
or replace getById with the test file you wish to run.

If you'd like to run a single test case:
`npm run test -- -t "get a nonexistent id" --testTimeout 10000`
or replace with the test descriptor you'd like to run. Note that this will run all the tests with such a description regardless of the file.

# Adding Tests
You may add tests in any file with the `test('description', () => {});` Jest syntax. I advise using async/await as the other tests do (eg, `test('description', async () => {});` and functions requiring Jest to wait for a response written as `await function()`.)

New test files should be placed under the `test/` directory and named as `{name}.test.js`, otherwise Jest won't pick them up.

# TODOs and Improvements

Given more time, I'd refactor these to reduce duplication. As it is, I wanted to err on the side of making the test cases for each suite clear; in a day-to-day environment I would write them a bit more concisely and abstract more logic.
I'd like to review them for JavaScript best practices, though I imagine that would come out in a code review. 
I'd also like to test the API endpoints themselves a bit more and possibly write a few tests comparing the endpoint response via `request` vs. the response from the SDK to detect inconsistencies early, as well as dig deeper into the endpoints' sending proper response codes.

I'd also like to refactor to speed the tests up -- the extended timeout and sequential running are timing issues relating to test account creation and the way Jest runs under the hood. I don't understand the latter as well as I'd like and would be able to make it more elegant given more time.

Jenkins hooks are not given here, though Jest integrates with Jenkins via the `jest-junit` package (not included here) and a few config files. It would be pretty easy to modify for CI. 