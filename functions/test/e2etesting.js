/**
 * Created by homeyxue on 2018-02-03.
 */

//selenium web driver require for all test suite
var webdriver = require('selenium-webdriver'),
    { describe, it, before, after } = require('selenium-webdriver/testing');

        By = webdriver.By,
        until = webdriver.until,
        assert = require('assert');

/**
 * If we are using Firefox for testing, we need to set up
 * Firefox browser option because our team use Firefox developer edition, not the default Firefox
 */
//var firefox = require('selenium-webdriver/firefox');

//var profile = new firefox.Profile( '/Users/homeyxue/Library/Application Support/Firefox/Profiles/8htp4yu0.dev-edition-default');
//var firefoxOptions = new firefoxOptions().setProfile(profile);
describe('home page test Suite', function(){

    this.timeout(50000);    //50 second time out max for waiting
    /**
     * web driver for each test case
     */
    beforeEach(function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
        driver.get("https://3dvisualizationtool.ml");

        driver.findElement(By.css('input')).sendKeys('oculus3dvisualizationtool@gmail.com');
        driver.findElement(By.id('identifierNext')).click();

        driver.wait(until.elementLocated(By.id('passwordNext')), 5000);
        driver.findElement(By.css('input')).sendKeys('osgood371');
        driver.findElement(By.id('passwordNext')).click();
    });

    /**
     * close web driver after each test case
     */
    afterEach(function(){

        driver.quit();

    });

    it("Timeout", function(){

        var promise;
        promise = new Promise(function(resolve, reject){
            setTimeout(function(){

                console.log("Timeout");
                resolve();

            }, 50000);  //50 seconds time out

        });
        // mocha will wait for the promise to be resolved before exiting
        return promise;
    });

    it("Title should print", function(){
        return driver.getTitle().then(function ( title ) {
            console.log(title);

            assert(title === "3D Visualization Tool");
        });
    });

    it("home button should be active", function(){

        var my_classType = 'active';
        var my_href = '/';

        var button = driver.findElement(By.className(my_classType));
        expect(button.href).toEqual(my_href);
    });

    it("home page body should display", function() {

        var body_1 = driver.findElement(By.className('site-wapper'));
        var body_2 = driver.findElement(By.className('site-wapper-inner'));
        var body_3 = driver.findElement(By.className('container'));

        expect(body_1.isDisplayed()).toEqual([true]);
        expect(body_2.isDisplayed()).toEqual([true]);
        expect(body_3.isDisplayed()).toEqual([true]);
    });

    it("home page title & nav should display", function() {

        var top = driver.findElement(By.className('container inner'));
        var title = driver.findElement(By.className('masthead-brand'));
        var nav = driver.findElement(By.className('nav masthead-nav'));

        expect(top.isDisplayed()).toEqual([true]);
        expect(title.isDisplayed()).toEqual([true]);
        expect(nav.isDisplayed()).toEqual([true]);
    });

    it("Click dashboard button should work", function(){
        var dashboard = driver.findElement(By.className('btn btn-lg btn-default'));     /** Dashboard button should click*/
        dashboard.click();
        driver.wait(until.elementLocated(By.id('contentBox')), 5000);     //'contentBox is a id of a new element, therefore should work'
        driver.getCurrentUrl().then(function( url ){
            assert(url === "https://3dvisualizationtool.ml/dashboard");
        });

    });
});

describe("Dashboard page test Suite", function(){
    this.timeout(50000);    //50 second time out for waiting
    /**
     * web driver for each test case
     */
    beforeEach(function(){

        driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        driver.get("https://3dvisualizationtool.ml/dashboard");
    });

    /**
     * close web driver after each test case
     */
    afterEach(function(){

        return driver.quit(s);

    });

    it("dashboard button should be active", function(){

        var my_classType = 'active';
        var my_href = '/dashboard';

        var button = driver.findElement(By.className(my_classType));
        expect(button.href).toEqual(my_href);
    });

    it("dashboard page body should display", function() {

        var body_1 = driver.findElement(By.className('site-wapper'));
        var body_2 = driver.findElement(By.className('site-wapper-inner'));
        var body_3 = driver.findElement(By.className('container'));

        expect(body_1.isDisplayed()).toEqual([true]);
        expect(body_2.isDisplayed()).toEqual([true]);
        expect(body_3.isDisplayed()).toEqual([true]);
    })

    it("dashboard page title & nav should display", function() {

        var top = driver.findElement(By.className('container inner'));
        var title = driver.findElement(By.className('masthead-brand'));
        var nav = driver.findElement(By.className('nav masthead-nav'));

        expect(top.isDisplayed()).toEqual([true]);
        expect(title.isDisplayed()).toEqual([true]);
        expect(nav.isDisplayed()).toEqual([true]);
    })


    it("should load file", function() {

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

        /**
         * TODO: load file; no idea how to check correctness yet
         *
         */
    })



});
