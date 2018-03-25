// //helping Owen with e2e test
// var webdriver = require('selenium-webdriver');
// By = webdriver.By,
// until = webdriver.until,
// assert = require('assert');
//
// //var driver;
//
// describe('e2e tests', function(){
//   before(() => {
//     driver = new webdriver.Builder().forBrowser('firefox').build();
//     driver.get("https://3dvisualizationtool.ml");
//     driver.getCurrentUrl().then(function( url ){
//     console.log(url);
//   });
//     //driver.navigate().to('https://3dvisualizationtool.ml');
//   });
//
//   it("title should print", () =>{
//     driver.getCurrentUrl().then(function( url ){
//     console.log(url);
//   });
//    driver.getTitle().then(function ( title ) {
//      console.log(title);
//    });
//  });
//
//  after(() =>{
//   //driver.quit();
//   //driver.close();
//  });
//
// });


/**
 * Created by homeyxue on 2018-02-03.
 */

//selenium web driver require for all test suite
var webdriver = require('selenium-webdriver');
  //  { describe, it, before, after } = require('selenium-webdriver/testing');

        By = webdriver.By,
        until = webdriver.until,
        assert = require('assert');
/**
 * Using Firefox for testing, we need to install geckodriver
 * Using chrom for testing, we need to install chromedriver
 */
 describe('home page test Suite', function(done){
 this.timeout(50000);
 /**
  * web driver for test case
  */
 before(() =>{
   driver = new webdriver.Builder()
 .forBrowser('firefox')
 .build();

 driver.get("https://3dvisualizationtool.ml");

 // driver.wait(until.elementLocated(By.id("identifierId")), 50000);
 // driver.getCurrentUrl().then(function( url ){
 // console.log(url);
 // //assert(url === "https://accounts.google.com/signin/oauth/identifier?client_id=483800110325-b8qec0kh5fcljpm2ju8bd88gsjn2vb7d.apps.googleusercontent.com&as=lME8KI5lhapLxK0Kwfo2Eg&destination=https%3A%2F%2Foculus-3d-visualization-c5687.firebaseapp.com&approval_state=!ChQ3MW5TcWF1MjF3MkNmLTMwY3BvdRIfWXdaTVdONGQ4R1VVNEpEYnJUUGdXM0JjOUxIV0hoWQ%E2%88%99ACThZt4AAAAAWpxONDNM9zl4shEwa2Fu0vyaaziEtMyJ&xsrfsig=AHgIfE-U6vvxzqUjBvRXDlGwq0dJrAOwQA&flowName=GeneralOAuthFlow");
 // });
 //
 // driver.findElement(By.id("identifierId")).sendKeys('oculus3dvisualizationtool@gmail.com');
 // driver.findElement(By.id("identifierNext")).click();
 //
 // driver.wait(until.elementLocated(By.id("passwordNext")), 50000);
 // driver.findElement(By.className("whsOnd zHQkBf")).sendKeys('osgood371');
 // driver.findElement(By.id("passwordNext")).click();

 driver.wait(until.elementLocated(By.xpath("/html/body/div/div/div/div[1]/div/nav/ul/li[1]/a")), 50000);
 driver.getCurrentUrl().then(function( url ){
 console.log(url);
 assert(url === "https://3dvisualizationtool.ml");
 });
 });

 /**
  * close web driver after test case
  */
 after(() =>{
   driver.quit();
   driver.close();
 });

 it("title should print", () =>{

 driver.getTitle().then(function ( title ) {
 console.log(title);

 assert(title === "3D Visualization Tool");
 });

 });

 it("home should be active", () => {

 var home = driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div/nav/ul/li[1]/a'));
  home.getAttribute('className').then(function(field){
    assert(field === 'active');
  });
 })

it("click logo should work", () =>{

    var logo = driver.findElement(By.id('logo'));
    logo.click();
    logo.clear();
    });
 it("click Home should work", () =>{

 var home = driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div/nav/ul/li[1]/a'));
  home.click();
  driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/div[1]/div/h3')), 50000);     //should stay in the same page
  driver.getCurrentUrl().then(function( url ){
    assert(url === "https://3dvisualizationtool.ml");
  });
 });

 it("click Features should work", () =>{

 var feature = driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div/nav/ul/li[2]/a'));     /** Dashboard button should click*/
  feature.click();
  driver.wait(until.elementLocated(By.className('inner cover')), 50000);     //'inner cover' is a id of a new element, therefore should work'
  driver.getCurrentUrl().then(function( url ){
    assert(url === "https://3dvisualizationtool.ml/features");
  });
 });

 it("click About Us should work", () =>{

 var about = driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div/nav/ul/li[3]/a'));     /** Dashboard button should click*/
  about.click();
  driver.wait(until.elementLocated(By.className('inner cover')), 50000);     //'inner cover' is a id of a new element, therefore should work'
  driver.getCurrentUrl().then(function( url ){
    assert(url === "https://3dvisualizationtool.ml/about");
  });
 });

 it("click Dashboard(nav bar) should work", () =>{

 var about = driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div/nav/ul/li[4]/a'));     /** Dashboard button should click*/
  about.click();
  driver.wait(until.elementLocated(By.id('contentBox')), 50000);     //'contentBox' is a id of a new element, therefore should work'
  driver.getCurrentUrl().then(function( url ){
    assert(url === "https://3dvisualizationtool.ml/dashboard");
  });
 });

 it("click dashboard button should work", () =>{

 var dashboard = driver.findElement(By.xpath('/html/body/div/div/div/div[2]/p[2]/a'));     /** Dashboard button should click*/
  dashboard.click();
  driver.wait(until.elementLocated(By.id('contentBox')), 50000);     //'contentBox' is a id of a new element, therefore should work'
  driver.getCurrentUrl().then(function( url ){
    assert(url === "https://3dvisualizationtool.ml/dashboard");
  });
  });
 });

 ///////////////////////////////////////////////////dashboard page///////////////////////////////////////////////////////////////////////////
 describe("Dashboard page test Suite", function(done){
     this.timeout(50000);
     /**
      * web driver for test case
      */
     before(function(){
         driver = new webdriver.Builder()
             .forBrowser('firefox')
             .build();
         driver.get("https://3dvisualizationtool.ml/dashboard");
     });

     /**
      * close web driver after test case
      */
     after(function(){
         //driver.quit();
         //driver.close();
     });

     it("dashboard should be active", () => {

         var dash = driver.findElement(By.xpath('/html/body/div/div[1]/div[1]/div/div/nav/ul/li[4]/a'));
         dash.getAttribute('className').then(function(field){
             assert(field === 'active');
         });
         })

     it("click VRworld should work", () => {

         var VRw0 = driver.findElement(By.xpath('//*[@id="-L7rBnAYpu6brWkJJama"]'));

         VRw0.click();
         driver.wait(until.elementLocated(By.xpath('//*[@id="exit"]')), 50000);     //'VR Visualization Tool' is a new element, therefore should work'
         driver.getCurrentUrl().then(function( url ){
             assert(url === "https://3dvisualizationtool.ml/VRWorld");
         });
         })

     it("click work without VR should work", () => {

         var VRw0 = driver.findElement(By.xpath('//*[@id="-L7rBnAYpu6brWkJJama"]'));
         VRw0.click();
         driver.wait(until.elementLocated(By.xpath('//*[@id="exit"]')), 50000);     //'VR Visualization Tool' is a new element, therefore should work'

         var noVR = driver.findElement(By.xpath('//*[@id="exit"]'));
         noVR.click();
         driver.wait(until.elementLocated(By.xpath('//*[@id="ui"]')), 50000);

         var display = driver.findElement(By.xpath('//*[@id="ui"]'));
         display.getAttribute('style').then(function(field){
             assert(field === 'display: none;');
         });
         })

     it("click load local file should work", function() {

         driver.wait(until.elementLocated(By.xpath('//*[@id="newWorldButton"]')), 10000);

         var loadNew = driver.findElement(By.xpath('//*[@id="newWorldButton"]'));
         loadNew.click();
         driver.wait(until.elementLocated(By.xpath('//*[@id="loadLocalButton"]')), 50000);

         var local = driver.findElement(By.xpath('//*[@id="loadLocalButton"]'));
         local.click();
         driver.wait(until.elementLocated(By.xpath('//*[@id="formGroup"]/div[1]/input')), 50000);

         var FILE_PATH = '/Users/homeyxue/Oculus-3D-Visualization-Tool/dev_helpers/cities.csv';

         driver.findElement(By.xpath('//*[@id="formGroup"]/div[1]/input')).sendKeys(FILE_PATH);
         var submit = driver.findElement(By.xpath('//*[@id="loadCsvButton"]'));

         driver.findElement(By.xpath('//*[@id="loadCsvButton"]')).click();
     })

     it("click url file should work", function() {

         var loadNew = driver.findElement(By.xpath('/html/body/div/div[1]/div[2]/nav/ul/a'));
         loadNew.click();
         driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div[2]/div/div/div[2]/div/div[1]/div/a[2]')), 50000);

         var url = driver.findElement(By.name('/html/body/div[1]/div[2]/div/div/div[2]/div/div[1]/div/a[2]'));
         url.click();
         driver.wait(until.elementLocated(By.id('//*[@id="csvURL"]')), 50000);

         var FILE_PATH = '/Users/homeyxue/Oculus-3D-Visualization-Tool/dev_helpers/cities.csv';

         driver.findElement(By.xpath('//*[@id="csvURL"]')).sendKeys(FILE_PATH);
         var submit = driver.findElement(By.xpath('/html/body/div[1]/div[2]/div/div/div[2]/div/div[3]/div/div/div[1]/div[1]/span/button'));
         submit.click();

     })

     it("click start over should work", function(){
         driver.wait(until.elementLocated(By.xpath('//*[@id="newWorldButton"]')), 10000);

         var load = driver.findElement(By.xpath('//*[@id="newWorldButton"]'));
         load.click();
         driver.wait(until.elementLocated(By.xpath('//*[@id="loadLocalButton"]')), 50000);

         var local = driver.findElement(By.xpath('//*[@id="loadLocalButton"]'));
         local.click();
         driver.wait(until.elementLocated(By.xpath('//*[@id="step2"]/a')), 50000);

         var back = driver.findElement(By.xpath('//*[@id="step2"]/a'));
         back.click();


         driver.wait(until.elementLocated(By.xpath('//*[@id="step1"]')), 10000);
         var pane = driver.findElement(By.xpath('//*[@id="step1"]'));
         pane.getAttribute('class').then(function(field){
             assert(field === 'tab-pane fade active in');
         })
     });
 });


 /**
  * The test case below is to test if selenium runs properlly, which is the prerequirement of all the test case above
  */
 //
 // var webdriver = require('selenium-webdriver');
 //
 // // var By = webdriver.By;
 // // var until = webdriver.until;
 // // var assert = require('assert');
 //
 // const {Builder, By, Key, until} = require('selenium-webdriver');
 //
 //  describe('test selenium', function(){
 //      before(() =>{
 //          driver = new webdriver.Builder()
 //              .forBrowser('firefox')
 //              .build();
 //          driver.get("https://www.google.ca/");
 //
 //          driver.wait(until.elementLocated(By.xpath('//*[@id="lst-ib"]')), 10000);
 //
 //          var input1 = driver.findElement(By.xpath('//*[@id="lst-ib"]'));
 //          input1.click();
 //          input1.clear();
 //          input1.sendKeys("2018 calender");
 //
 //          //driver.findElement(By.xpath('//*[@id="lst-ib"]')).sendKeys("2018 calender");
 //
 //             var search1 = driver.findElement(By.xpath('/html/body/div/div[3]/form/div[2]/div[3]/center/input[1]'));
 //             search1.click();
 //
 //      });
 //      after(() =>{
 //          //driver.quit();
 //      });
 //
 //          it("click should work", () =>{
 //
 //           driver.wait(until.elementLocated(By.xpath('//*[@id="lst-ib"]')), 10000);
 //
 //           var input1 = driver.findElement(By.xpath('//*[@id="lst-ib"]'));
 //           input1.click();
 //           input1.clear();
 //           input1.sendKeys("2018 calender");
 //
 //           //driver.findElement(By.xpath('//*[@id="lst-ib"]')).sendKeys("2018 calender");
 //
 //              var search1 = driver.findElement(By.xpath('/html/body/div/div[3]/form/div[2]/div[3]/center/input[1]'));
 //              search1.click();
 //              // driver.wait(until.elementLocated(By.xpath('//*[@id="nav-list"]/li[2]/a')), 50000);     //should stay in the same page
 //              // driver.getCurrentUrl().then(function( url ){
 //              //   console.log(url);
 //              //     //assert(url === "about:blank");
 //              // });
 //              });
 //              });
