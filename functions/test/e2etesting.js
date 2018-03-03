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
//var firefox = require('selenium-webdriver/firefox');

//var profile = new firefox.Profile( '/Users/homeyxue/Library/Application Support/Firefox/Profiles/8htp4yu0.dev-edition-default');
//var firefoxOptions = new firefoxOptions().setProfile(profile);
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

        driver.findElement(By.css('input')).sendKeys('oculus3dvisualizationtool@gmail.com');
        driver.findElement(By.id('identifierNext')).click();

        driver.wait(until.elementLocated(By.id('passwordNext')), 5000);
        driver.findElement(By.css('input')).sendKeys('osgood371');
        driver.findElement(By.id('passwordNext')).click();
    });

    /**
     * close web driver after test case
     */
    after(() =>{
        driver.quit();
    });

    it("title should print", () =>{

        driver.getTitle().then(function ( title ) {
            console.log(title);

            assert(title === "3D Visualization Tool");
        });
    });

    it("home should be active", () => {

      var home = driver.findElement(By.name('Home'));
      home.getAttribute('className').then(function(field){
        assert(field === 'active');
      });
    })

    it("click Home should work", () =>{

      var home = driver.findElement(By.name('Home'));
      home.click();
      driver.wait(until.elementLocated(By.className('masthead-brand')), 5000);     //should stay in the same page
      driver.getCurrentUrl().then(function( url ){
          assert(url === "https://3dvisualizationtool.ml");
      });
    });

    it("click Features should work", () =>{

      var feature = driver.findElement(By.name('Features'));     /** Dashboard button should click*/
      feature.click();
      driver.wait(until.elementLocated(By.className('inner cover')), 5000);     //'inner cover' is a id of a new element, therefore should work'
      driver.getCurrentUrl().then(function( url ){
          assert(url === "https://3dvisualizationtool.ml/features");
      });
    });

    it("click About Us should work", () =>{

      var about = driver.findElement(By.name('About Us'));     /** Dashboard button should click*/
      about.click();
      driver.wait(until.elementLocated(By.className('inner cover')), 5000);     //'inner cover' is a id of a new element, therefore should work'
      driver.getCurrentUrl().then(function( url ){
          assert(url === "https://3dvisualizationtool.ml/about");
      });
    });

    it("click Dashboard(nav bar) should work", () =>{

      var about = driver.findElement(By.name('Dashboard'));     /** Dashboard button should click*/
      about.click();
      driver.wait(until.elementLocated(By.id('contentBox')), 5000);     //'contentBox' is a id of a new element, therefore should work'
      driver.getCurrentUrl().then(function( url ){
          assert(url === "https://3dvisualizationtool.ml/dashboard");
      });
    });

    it("click dashboard button should work", () =>{

        var dashboard = driver.findElement(By.className('btn btn-lg btn-default'));     /** Dashboard button should click*/
        dashboard.click();
        driver.wait(until.elementLocated(By.id('contentBox')), 5000);     //'contentBox' is a id of a new element, therefore should work'
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
 * Command out for now
 * because google switch account is not working yet
 */

/**
    it("click google button should work", () =>{

        var google = driver.findElement(By.id('connecteddq7u6owam3f3'));
        google.click();
        //TODO: test switch account function
    });
    */

    it("dashboard should be active", () => {

      var dash = driver.findElement(By.name('Dashboard'));
      dash.getAttribute('className').then(function(field){
        assert(field === 'active');
      });
    })

    it("click VRworld should work", () => {

        var VRw0 = driver.findElement(By.id('-L6UcY0EKaTU24sRbEq3'));
        var VRw1 = driver.findElement(By.id('-L6UdSwZZBWXNHBhp9cf'));
        var VRw2 = driver.findElement(By.id('-L6Ud_fayHJ9kHcmOwRf'));

        VRw0.click();
        driver.wait(until.elementLocated(By.name('VR Visualization Tool')), 5000);     //'VR Visualization Tool' is a new element, therefore should work'
        driver.getCurrentUrl().then(function( url ){
            assert(url === "https://3dvisualizationtool.ml/VRWorld");
        });
    })

    it("VRworld should work without VR", () => {

        var VRw1 = driver.findElement(By.id('-L6UdSwZZBWXNHBhp9cf'));
        VRw1.click();
        driver.wait(until.elementLocated(By.name('VR Visualization Tool')), 5000);     //'VR Visualization Tool' is a new element, therefore should work'

        var noVR = driver.findElement(By.name('Try it without a headset'));
        noVR.click();
        driver.wait(until.elementLocated(By.name('EXIT VR')), 5000);

        var display = driver.findElement(By.id('ui'));
        display.getAttribute('style').then(function(field){
          assert(field === 'display: none;');
        });
    })

    it("should load local file", function() {

        var button = driver.findElement(By.className('btn btn-info btn-lg'));
        button.click();
        driver.wait(until.elementLocated(By.id('myWizard')), 3000);

        var button2 = driver.findElement(By.name('Local'));
        button2.click();
        driver.wait(until.elementLocated(By.id('step2')), 3000);

        var FILE_PATH = '/Users/homeyxue/Oculus-3D-Visualization-Tool/dev_helpers/cities.csv';

        driver.findElement(By.className('form-control')).sendKeys(FILE_PATH);
        var button3 = driver.findElement(By.name('Load!'));
        button3.click();

    })

});
