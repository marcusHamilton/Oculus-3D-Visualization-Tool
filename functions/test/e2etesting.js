/**
 * Created by homeyxue on 2018-02-03.
 */

//selenium web driver require for all test suite
var webdriver = require('selenium-webdriver'),
    {describe, it, before, after} = require{'selenium-webdriver/testing'};
    By = webdriver.By,
        until = webdriver.until;

    var driver;

/**
 * If we are using Firefox for testing, we need to set up
 * Firefox browser option because our team use Firefox developer edition, not the default Firefox
 */
var firefox = require('selenium-webdriver/firefox');

var profile = new firefox.Profile( '/Users/homeyxue/Library/Application Support/Firefox/Profiles/8htp4yu0.dev-edition-default');
var firefoxOptions = new firefoxOptions().setProfile(profile);

describe("Home page test Suite", function(){

    this.timeout(50000);    //50 second time out for waiting
    /**
     * web driver for each test case
     */
    beforeEach(function(){

        driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        driver.get("https://3dvisualizationtool.ml");

    });

    /**
     * close web driver after each test case
     */
    afterEach(function(){

        return driver.quit(s);

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

describe("Dashboard page test Suite", function(){
    this.timeout(50000);    //50 second time out for waiting
    /**
     * web driver for each test case
     */
    beforeEach(function(){

        driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        driver.get("https://3dvisualizationtool.ml");
        // a promise is returned while ‘click’ action is registered in ‘driver’ object
        return driver.findElement(webdriver.By.className('btn btn-lg btn-default')).click();  /** Dashboard button should click*/

    });

    /**
     * close web driver after each test case
     */
    afterEach(function(){

        return driver.quit(s);

    });

    it("dashboard button should be active", function(){

        var my_classType = 'active';
        var my_href = "/dashboard";

        var button = element.all(by.className(my_classType));
        expect(button.href).toEqual(my_href);
    });

    it("dashboard page body should display", function() {

        var body_1 = element.all(by.className('site-wapper'));
        var body_2 = element.all(by.className('site-wapper-inner'));
        var body_3 = element.all(by.className('container'));

        expect(body_1.isDisplayed()).toEqual([true]);
        expect(body_2.isDisplayed()).toEqual([true]);
        expect(body_3.isDisplayed()).toEqual([true]);
    })

    it("dashboard page title & nav should display", function() {

        var top = element.all(by.className('container inner'));
        var title = element.all(by.className('masthead-brand'));
        var nav = element.all(by.className('nav masthead-nav'));

        expect(top.isDisplayed()).toEqual([true]);
        expect(title.isDisplayed()).toEqual([true]);
        expect(nav.isDisplayed()).toEqual([true]);
    })

    it("should load file", function() {
        /**
         * TODO: click load local(href = /localLoad); get load file; check data correctness
         */
    })



});