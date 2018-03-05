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
 driver.quit();
 });

 /**
  * Command out for now because this function is no working on our live page yet
  */

 /**
  it("click google button should work", () =>{

  var google = driver.findElement(By.id('connecteddq7u6owam3f3'));
  google.click();
  //TODO: test switch account function
  });
  */

 it("dashboard should be active", () => {

 var dash = driver.findElement(By.xpath('/html/body/div/div[1]/div[1]/div/div/nav/ul/li[4]/a'));
 dash.getAttribute('className').then(function(field){
 assert(field === 'active');
 });
 })

 it("click VRworld should work", () => {

 //var VRw0 = driver.findElement(By.id('-L6UcY0EKaTU24sRbEq3'));
 //var VRw1 = driver.findElement(By.id('-L6UdSwZZBWXNHBhp9cf'));
 //var VRw2 = driver.findElement(By.id('-L6Ud_fayHJ9kHcmOwRf'));

 var VRw0 = driver.findElement(By.xpath('//*[@id="-L6kqw1Ilu2xuK_UJ9ny"]'));

 VRw0.click();
 driver.wait(until.elementLocated(By.xpath('//*[@id="ui"]')), 50000);     //'VR Visualization Tool' is a new element, therefore should work'
 driver.getCurrentUrl().then(function( url ){
 assert(url === "https://3dvisualizationtool.ml/VRWorld");
 });
 })

 it("VRworld should work without VR", () => {

 var VRw0 = driver.findElement(By.xpath('//*[@id="-L6kqw1Ilu2xuK_UJ9ny"]'));
 VRw0.click();
 driver.wait(until.elementLocated(By.xpath('//*[@id="ui"]')), 50000);     //'VR Visualization Tool' is a new element, therefore should work'

 var noVR = driver.findElement(By.xpath('//*[@id="help"]/a'));
 noVR.click();
 driver.wait(until.elementLocated(By.xpath('//*[@id="ui"]')), 50000);

 var display = driver.findElement(By.xpath('//*[@id="ui"]'));
 display.getAttribute('style').then(function(field){
 assert(field === 'display: none;');
 });
 })

 it("should load local file", function() {

 var load = driver.findElement(By.xpath('//*[@id="contentBox"]/nav/ul/a'));
 load.click();
 driver.wait(until.elementLocated(By.xpath('//*[@id="step1"]/div/a[1]')), 50000);

 var local = driver.findElement(By.name('//*[@id="step1"]/div/a[1]'));
 local.click();
 driver.wait(until.elementLocated(By.id('//*[@id="formGroup"]/div[1]/input')), 50000);

 var FILE_PATH = '/Users/homeyxue/Oculus-3D-Visualization-Tool/dev_helpers/cities.csv';

 driver.findElement(By.xpath('//*[@id="formGroup"]/div[1]/input')).sendKeys(FILE_PATH);
 var submit = driver.findElement(By.xpath('//*[@id="formGroup"]/span[2]/button'));
 submit.click();

 })

 it("should url file", function() {

 var load = driver.findElement(By.xpath('/html/body/div[1]/div[2]/div/div/div[2]/div/div[1]/div/a[2]'));
 load.click();
 driver.wait(until.elementLocated(By.xpath('//*[@id="step1"]/div/a[1]')), 50000);

 var local = driver.findElement(By.name('//*[@id="step1"]/div/a[1]'));
 local.click();
 driver.wait(until.elementLocated(By.id('//*[@id="formGroup"]/div[1]/input')), 50000);

 var FILE_PATH = '/Users/homeyxue/Oculus-3D-Visualization-Tool/dev_helpers/cities.csv';

 driver.findElement(By.xpath('//*[@id="formGroup"]/div[1]/input')).sendKeys(FILE_PATH);
 var submit = driver.findElement(By.xpath('//*[@id="formGroup"]/span[2]/button'));
 submit.click();

 })

 it("click start over should work", function(){
   var load = driver.findElement(By.xpath('/html/body/div[1]/div[2]/div/div/div[2]/div/div[1]/div/a[2]'));
   load.click();
   driver.wait(until.elementLocated(By.xpath('//*[@id="step1"]/div/a[1]')), 50000);

   var local = driver.findElement(By.name('//*[@id="step1"]/div/a[1]'));
   local.click();
   driver.wait(until.elementLocated(By.id('//*[@id="formGroup"]/div[1]/input')), 50000);

   var back = driver.findElement(By.xpath('/html/body/div[1]/div[2]/div/div/div[2]/div/div[2]/a'))
   back.click();

   driver.wait(until.elementLocated(By.xpath('//*[@id="step1"]')), 50000);
   var pane = driver.findElement(By.xpath('//*[@id="step1"]'));
   pane.getAttribute('class').then(function(field){
   assert(field === 'tab-pane fade active in');
    })
  });
});





 // describe('test selenium', function(done){
 //   this.timeout(50000);
 //     /**
 //      * web driver for test case
 //      */
 //     before(() =>{
 //         driver = new webdriver.Builder()
 //             .forBrowser('firefox')
 //             .build();
 //         driver.get("https://www.google.ca/");
 //
 //         driver.wait(until.elementLocated(By.xpath('//*[@id="tsf"]/div[2]/div[3]/center/input[2]')), 50000);
 //         driver.getCurrentUrl().then(function( url ){
 //           console.log(url);
 //             //assert(url === "https://accounts.google.com/signin/oauth/identifier?client_id=483800110325-b8qec0kh5fcljpm2ju8bd88gsjn2vb7d.apps.googleusercontent.com&as=lME8KI5lhapLxK0Kwfo2Eg&destination=https%3A%2F%2Foculus-3d-visualization-c5687.firebaseapp.com&approval_state=!ChQ3MW5TcWF1MjF3MkNmLTMwY3BvdRIfWXdaTVdONGQ4R1VVNEpEYnJUUGdXM0JjOUxIV0hoWQ%E2%88%99ACThZt4AAAAAWpxONDNM9zl4shEwa2Fu0vyaaziEtMyJ&xsrfsig=AHgIfE-U6vvxzqUjBvRXDlGwq0dJrAOwQA&flowName=GeneralOAuthFlow");
 //         });
 //     });
 //
 //     /**
 //      * close web driver after test case
 //      */
 //     after(() =>{
 //         driver.quit();
 //     });
 //
 //         it("click should work", () =>{
 //
 //             var home = driver.findElement(By.xpath('//*[@id="tsf"]/div[2]/div[3]/center/input[2]'));
 //             home.click();
 //             driver.wait(until.elementLocated(By.xpath('//*[@id="nav-list"]/li[2]/a')), 50000);     //should stay in the same page
 //             driver.getCurrentUrl().then(function( url ){
 //               console.log(url);
 //                 //assert(url === "about:blank");
 //             });
 //             });
