/**
 * Created by homeyxue on 2018-02-03.
 */
describe("Home page test Suite", function(){
    browser.ignoreSynchronization = true;   //if not written by angluar
    browser.get("https://3dvisualizationtool.ml");

    /**
     * browser set up and selenium web-driver buid
     */
    var webdriver = require('selenium-webdriver')
    var chrome = require('selenium-webdriver/chrome');
    var firefox = require('selenium-webdriver/firefox');

    var profile = new firefox.Profile( '/Users/homeyxue/Library/Application Support/Firefox/Profiles/8htp4yu0.dev-edition-default');
    var firefoxOptions = new firefoxOptions().setProfile(profile);

    var profile1 = new chrome.Profile('/Users/homeyxue/Library/Application Support/Google/Chrome/Default');
    var chromeOptions = new chromeOptions().setProfile(profile1);

    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(firefoxOptions)
        .setChromeOptions(chromeOptions)
        .build();

    /**
     * test suite setup
     */
    before(function(){

        driver.get("https://3dvisualizationtool.ml");

        // a promise is returned while ‘click’ action is registered in ‘driver’ object
        //return driver.findElement(webdriver.By.id(loadLocal)).click();  /** id=loadLocal have NOT been added into html yet*/
    });

    /**
     * web-driver close after test suite finish
     */
    after(function(){

        return driver.quit();

    });

    beforeEach(function(){

        // do something before test case execution
        // no matter if there are failed cases

    });

    /**
     * test suite teardown repeat(not use yet)
     */
    afterEach(function(){

        // do something after test case execution is finished
        // no matter if there are failed cases

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

        var my_title = "3D Visualization Tool";
        driver.getTitle().then(function ( title ) {
            expect(title).equals( my_title );
            console.log(title)      // assertions: "3D Visualization Tool" should be printed
        });
    });

    it("home button should be active", function(){

        var my_classType = 'active';
        var my_href = "/";

        var button = element.all(by.className(my_classType));
        expect(button.href).toEqual(my_href);
    });

    it("home page body should display", function() {

        var body_1 = element.all(by.className('site-wapper'));
        var body_2 = element.all(by.className('site-wapper-inner'));
        var body_3 = element.all(by.className('container'));

        expect(body_1.isDisplayed()).toEqual([true]);
        expect(body_2.isDisplayed()).toEqual([true]);
        expect(body_3.isDisplayed()).toEqual([true]);
    })

    it("home page title & nav should display", function() {

        var top = element.all(by.className('container inner'));
        var title = element.all(by.className('masthead-brand'));
        var nav = element.all(by.className('nav masthead-nav'));

        expect(top.isDisplayed()).toEqual([true]);
        expect(title.isDisplayed()).toEqual([true]);
        expect(nav.isDisplayed()).toEqual([true]);
    })
});

describe("Load Local page test Suite", function(){
    browser.ignoreSynchronization = true;   //if not written by angluar
    browser.get("https://3dvisualizationtool.ml");

    /**
     * browser set up and selenium web-driver buid
     */
    var webdriver = require('selenium-webdriver')
    var chrome = require('selenium-webdriver/chrome');
    var firefox = require('selenium-webdriver/firefox');

    var profile = new firefox.Profile( '/Users/homeyxue/Library/Application Support/Firefox/Profiles/8htp4yu0.dev-edition-default');
    var firefoxOptions = new firefoxOptions().setProfile(profile);

    var profile1 = new chrome.Profile('/Users/homeyxue/Library/Application Support/Google/Chrome/Default');
    var chromeOptions = new chromeOptions().setProfile(profile1);

    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(firefoxOptions)
        .setChromeOptions(chromeOptions)
        .build();

    /**
     * test suite setup
     */
    before(function(){

        driver.get("https://3dvisualizationtool.ml");

        // a promise is returned while ‘click’ action is registered in ‘driver’ object
        return driver.findElement(webdriver.By.id(loadLocal)).click();  /** id=loadLocal have NOT been added into html yet*/
    });

    /**
     * web-driver close after test suite finish
     */
    after(function(){

        return driver.quit();

    });

    beforeEach(function(){

        // do something before test case execution
        // no matter if there are failed cases

    });

    /**
     * test suite teardown repeat(not use yet)
     */
    afterEach(function(){

        // do something after test case execution is finished
        // no matter if there are failed cases

    });

    it("Timeout", function(){

        var promise;
        promise = new Promise(function(resolve, reject){
            setTimeout(function(){

                console.log("Timeout");
                resolve();

            }, 3000);

        });
        // mocha will wait for the promise to be resolved before exiting
        return promise;
    });

    it("localLoad button should be active", function(){

        var my_classType = 'active';
        var my_href = "/localLoad";

        var button = element.all(by.className(my_classType));
        expect(button.href).toEqual(my_href);
    });

    it("localLoad page body should display", function() {

        var body_1 = element.all(by.className('site-wapper'));
        var body_2 = element.all(by.className('site-wapper-inner'));
        var body_3 = element.all(by.className('container'));

        expect(body_1.isDisplayed()).toEqual([true]);
        expect(body_2.isDisplayed()).toEqual([true]);
        expect(body_3.isDisplayed()).toEqual([true]);
    })

    it("localLoad page title & nav should display", function() {

        var top = element.all(by.className('container inner'));
        var title = element.all(by.className('masthead-brand'));
        var nav = element.all(by.className('nav masthead-nav'));

        expect(top.isDisplayed()).toEqual([true]);
        expect(title.isDisplayed()).toEqual([true]);
        expect(nav.isDisplayed()).toEqual([true]);
    })

    it("load local page should load file", function() {
        /**
         * TODO: click load local(href = /localLoad); get load file; check data correctness
         */
    })



});