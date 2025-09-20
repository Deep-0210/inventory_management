**Unit Test Case and Integration Test Case**

- The difference between the <b>Unit test</b> and <b>Integration test case</b> is in unit testing we test any small module for expected output while in the integration test case we test any complete module.

- In case of Node.Js for integration test case we can test any module like from the app we can call any API with real database query and at the end of the execution we can expect like the status code should be this and the response message should be this.

**Steps to set-up Unit Test Case Writing**

1. <code>npm install --save-dev jest ts-jest @types/jest
   </code>

2. <code>npx ts-jest config:init
   </code>

3. Check <b>UnitTestCases</b> folder for better idea of writing <b>Unit Test Cases</b>

4. <code>"test": "jest"</code> add in package.json script to run test cases

5. <code>npm test</code> command to tun test cases

**Steps to set-up Integration Test Case Writing**

1. <code>npm install --save-dev jest ts-jest @types/jest supertest @types/supertest
   </code>

2. <code>npx ts-jest config:init
   </code>

3. Check <b>IntegrationTestCases</b> folder for better idea of writing <b>Integration Test Cases</b>

4. <code>"test": "jest"</code> add in package.json script to run test cases

5. <code>npm test</code> command to tun test cases
