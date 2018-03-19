var webdriver = require('selenium-webdriver');
var path = require('path');

// console.log(path.resolve("../../dev_helpers"));

By = webdriver.By,
until = webdriver.until,
assert = require('assert');


describe('e2e tests', function(){
  this.timeout(50000);

  before(() => {
    driver = new webdriver.Builder().forBrowser('firefox').build();
    console.log("beforeeeee");
    driver.get("http://localhost:5000/dashboard");
    // driver.wait(until.elementLocated(By.))
  });

  after(() =>{
    console.log("all done");
    // driver.quit();
    // driver.close();
  });

  it("title should print", () =>{
   driver.getTitle().then(function ( title ) {
     console.log(title);
   });
  });

  it("should load create new world correctly", () =>{
    driver.wait(until.elementLocated(By.id("newWorldButton")), 50000);
    var newButton = driver.findElement(By.id('newWorldButton'));
    newButton.click();

    driver.wait(until.elementLocated(By.id("loadLocalButton")), 50000);
    var loadLocalButton = driver.findElement(By.id('loadLocalButton'));
    loadLocalButton.click();

    driver.wait(until.elementLocated(By.id('csv-file')), 50000);
    var testFilePath = path.resolve('../../dev_helpers/newWorldTestInput.csv');
    // console.log(testFilePath);

    driver.findElement(By.id('csv-file')).sendKeys(testFilePath);
    var loadButton = driver.findElement(By.id('loadCsvButton'));
    loadButton.click();
  });

  // it("should load local file", function() {
  //
  // var load = driver.findElement(By.xpath('//*[@id="contentBox"]/nav/ul/a'));
  // load.click();
  // driver.wait(until.elementLocated(By.xpath('//*[@id="step1"]/div/a[1]')), 50000);
  //
  // var local = driver.findElement(By.name('//*[@id="step1"]/div/a[1]'));
  // local.click();
  // driver.wait(until.elementLocated(By.id('//*[@id="formGroup"]/div[1]/input')), 50000);
  //
  // var FILE_PATH = '/home/owen/Desktop/Oculus-3D-Visualization-Tool/dev_helpers/newWorldTestInput.csv';
  //
  // driver.findElement(By.xpath('//*[@id="formGroup"]/div[1]/input')).sendKeys(FILE_PATH);
  // var submit = driver.findElement(By.xpath('//*[@id="formGroup"]/span[2]/button'));
  // submit.click();

  // })


});
