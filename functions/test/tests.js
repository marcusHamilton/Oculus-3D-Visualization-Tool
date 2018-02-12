var myFunctions, configStub, adminInitStub, functions, admin;
const assert = require('chai').assert;
const mocha = require('mocha');
const sinon = require('sinon');

describe('Cloud Functions', () => {

  before(() => {
      firebase = require('firebase-admin');
      firebaseInitStub = sinon.stub(firebase, 'initializeApp');

      functions = require('firebase-functions');
      configStub = sinon.stub(functions, 'config').returns({
        firebase: {
          databaseURL: 'https://not-a-project.firebaseio.com',
          storageBucket: 'not-a-project.appspot.com',
        }
        // You can stub any other config values needed by your functions here, for example:
        // foo: 'bar'
      });

      myFunctions = require('../app');
  });

  after(() => {
    // Restoring our stubs to the original methods.
    configStub.restore();
    firebaseInitStub.restore();
  });


  describe('Hello', () => {
    it('should print hello', () => {
      return assert.equal(myFunctions.hello(), 'hello');
    });
  });


});
