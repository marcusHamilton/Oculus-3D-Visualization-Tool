var webdriver = require('selenium-webdriver');
By = webdriver.By,
until = webdriver.until,
assert = require('assert');


describe('e2e tests', function(){
  before(() => {
    driver = new webdriver.Builder().forBrowser('firefox').build();
    driver.get("https://3dvisualizationtool.ml");
    driver.navigate().to('https://3dvisualizationtool.ml');
  });

  after(() =>{
   driver.quit();
   driver.close();
  });

  it("title should print", () =>{
   driver.getTitle().then(function ( title ) {
     console.log(title);
   });
 });

});
