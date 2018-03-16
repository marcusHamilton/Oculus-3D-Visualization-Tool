var myFunctions, configStub, adminInitStub, functions, firebase, db;
var firebaseInitStub;
const firebaseServer = require('firebase-server');

const assert = require('chai').assert;
const mocha = require('mocha');
const sinon = require('sinon');
// const firebaseServer = require('firebase-server');

const refStub = sinon.stub();
const databaseStub = sinon.stub();


before(() => {
  firebase = require('firebase');

  var fakeFirebase = require('firebase-admin');
  firebaseInitStub = sinon.stub(fakeFirebase, 'initializeApp');

  var functions = require('firebase-functions');
  configStub = sinon.stub(functions, 'config').returns({
    firebase: {
      databaseURL: 'https://not-a-project.firebaseio.com',
      storageBucket: 'not-a-project.appspot.com'
    }
  });
  myFunctions = require('../app');

  //Create Firebase server
  fbServer = new firebaseServer(5000, 'localhost.firebaseio.test', {
      workers: {
          tester: "Owen",
          dev: "wynston"
      }
  });

  //fake api key and url of the locally hosted firebase database
  const config = {
     apiKey: '12345',
     databaseURL: 'ws://localhost.firebaseio.test:5000'
   }

  var app = firebase.initializeApp(config, 'TestingEnvironment');
  console.log('local Firebase Initialized');

  db = app.database();

});

after(() => {
  fbServer.close(console.log('server closed'));
  configStub.restore();
  firebaseInitStub.restore();
  // process.exit(1);
});


describe('Upload World', () => {
  it('Should upload world to the database and return the world id', () => {
    var worldData = "testData";
    db.ref('/').set({
        item: worldData
      });

    // var worldsRef = db.ref("/worlds").set
    // var newWorldRef = worldsRef.push(worldData);
    var newWorldId = '12345';
    assert.equal(newWorldId, '12345');
  });
});

describe('Get World', () => {
  it('Get world from the database', () => {
    // var worldJSON = { item: 'testData' };
    var data = null;
    db.ref('/').once('value').then(function(snapshot) {
      data = snapshot.val();
      assert.equal(data.item, "testData");
    });
  });
});

describe('Update World', () => {
  it('Update world in the database', () => {
    var newData = {item: 'newData'};
    var ref = db.ref('/').child("item");
    ref.update(newData);

    var data = null;
    db.ref('/').once('value').then(function(snapshot) {
      data = snapshot.val();
      assert.equal(data.item.item, "newData");
    });
  });
});

describe('Delete World', () => {
  it('Delete world from the database', () => {
    // var worldJSON = { item: 'testData' };
    var data = null;
    db.ref('/').remove().then(function(snapshot) {
      data = snapshot.val();
      assert.equal(data, null);
    });
  });
});