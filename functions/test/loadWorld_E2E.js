var webdriver = require('selenium-webdriver');
By = webdriver.By,
until = webdriver.until,
assert = require('assert');


describe('e2e tests', function(){
  this.timeout(50000);

  before(() => {
    driver = new webdriver.Builder().forBrowser('firefox').build();
    console.log("beforeeeee");
    driver.get("https://www.google.ca");
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

});
