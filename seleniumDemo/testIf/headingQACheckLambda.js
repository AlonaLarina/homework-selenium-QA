// ---------- LAMBDA PLATFORM TEST on Chrome 99.0 / Win 10 ----------
const { Builder, By, Key } = require('selenium-webdriver');
const ltCapabilities = require('../capabilities');
var should = require('chai').should();

//describe block
describe('check the correctness of the job title for QA', function () {
    var driver;

    //username
    const USERNAME = ltCapabilities.capabilities.user;

    //key
    const KEY = ltCapabilities.capabilities.accessKey;

    //host
    const GRID_HOST = 'hub.lambdatest.com/wd/hub';

    //grid url
    const gridUrl = 'https://' + USERNAME + ':' + KEY + '@' + GRID_HOST;

    //application url
    const url = 'https://www.if.lv/';


    browsers = [
      { browser: "Chrome", bVersion: "99.0", os: "Windows 10" },
      { browser: "Firefox", bVersion: "98.0", os: "Windows 10" },
      { browser: "Firefox", bVersion: "97.0", os: "Windows 10" }
    ];

    browsers.forEach(({browser, bVersion, os}) => {


    //it block
    it(`Make sure the title matches the given expectations for browser ${browser}, ${bVersion}, ${os}`, async function () {

        ltCapabilities.capabilities.platformName = os
        ltCapabilities.capabilities.browsermName = browser
        ltCapabilities.capabilities.browserVersion = bVersion

        ltCapabilities.capabilities.name = this.test.title;

        //launch the test browser
        driver = new Builder()
        .usingServer(gridUrl)
        .withCapabilities(ltCapabilities.capabilities)
        .build();

        //navigate to IF application (1)
        await driver.get(url);

        //---------------- accepting cookies ----------------
        //wait 5 sec, and try to search Piekritu button and click
        await driver.sleep(5000);

        //search parent panel
        var cookieBanner = driver
        .findElement(By.xpath("//*[@id='onetrust-banner-sdk' and @class='otFlat top vertical-align-content']"));

        if (cookieBanner == null) throw "The cookie accept banner not found";
        else {
            await driver
            .findElement(By.xpath("//*[@id='onetrust-accept-btn-handler' and text()='Piekrītu']"))
            .click();
        }
        //---------------- cookies accepted ------------------

         //navigate to Par If menu (2)
         var menuParIf = await driver.findElement(By.linkText("Par If"));
         if (menuParIf == null) throw "Par if menu not found";
         else {
             menuParIf.click();
         }

        //navigate to Darbs If menu (3)
        await driver
          .findElement(By.linkText('Darbs If')).click();

        //navigate to Vakances menu (4)
        await driver
          .findElement(By.linkText('Vakances')).click();

        //---------------------- HEADING ---------------------------
        //click the button that would lead to Quality Assurance/Test Automation Specialist (5)
        //make sure that the heading is “Quality Assurance/Test Automation Specialist (6)
        var headingQAexpected = "Quality Assurance/Test Automation Specialist";
        var xpathLinkQA = "//*[contains(@href, '/par-if/darbs-if/vakances/QA-test-automation-specialist')]";
        var xpathForParentLiQA = xpathLinkQA + "/parent::li[@class='if navigational-card lifestyle']";

        //await driver.findElement(By.xpath(xpathForParentLiQA + "/div/p[contains(text(),'" + headingQAexpected + "')]")).click();

        let headingQA = await driver
        .findElement(By.xpath(xpathForParentLiQA + "/div/p[2]"))
        .getText().then(function (value) {
        return value
        });

        //--------------------- scroll page into view --------------
        var liParentElement = driver.findElement(By.xpath(xpathForParentLiQA));
        driver.executeScript("arguments[0].scrollIntoView()", liParentElement);
        driver.sleep(300);
        //----------------------------scrolled----------------------

        //-------------- taking a screenshot of current page -------
        driver.takeScreenshot().then(
          function(image) {
              require('fs').writeFileSync('my_captured_image_1-01_vakances.png', image, 'base64');
          });
        //--------- see screenshot in seleniumDemo folder -----------


        //--------------- option 1 ------------------
        try {
          //assert using chai should
          //headingQA.should.equal(headingQAexpected)
          //assert.strictEqual(headingQA,headingQAexpected)

          if (headingQA.should.equal(headingQAexpected)) {
              // good path if heading = "Quality Assurance/Test Automation Specialist"
              await driver.findElement(By.xpath(xpathLinkQA)).click();
              
              //-------------- taking a screenshot of current page -------
              driver.takeScreenshot().then(
              function(image) {
                  require('fs').writeFileSync('my_captured_image_1-11_quality.png', image, 'base64');
              });
              //--------- see screenshot in seleniumDemo folder -----------

              //it is good to close the browser at the end
              await driver.quit();
          }
          return true;
          } 
          catch (e) { //AssertionError
              // Catch block
              //handle the failure of test, take a screenshot of the current page (7)
              //for screenshot taking - in capabilities.js, "visual" : true

              //-------------- taking a screenshot of current page -------
      
              driver.takeScreenshot().then(
              function(image) {
                  require('fs').writeFileSync('my_captured_image_1-12_QA.png', image, 'base64');
              });
          
              //--------- see screenshot in seleniumDemo folder -----------

              await driver.sleep(2000);
              await driver.quit();
              
              throw new Error("AssertionError: expected '" + headingQA + "' to equal '" + headingQAexpected + "'. Result: (+) Expected: " + headingQAexpected + " // (-) Actual: " + headingQA + " ¯\_(ツ)_/¯");
          }
      //------------ end of option 1 --------------

    });

  });
});