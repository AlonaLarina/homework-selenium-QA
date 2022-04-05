// ---------- LOCAL TEST on Firefox ----------
const { assert } = require("chai");
const { Builder, By, Key, Until } = require("selenium-webdriver");
var should = require("chai").should();

//describe block
describe("Navigate to QA vacancy and check the correctness of the job title for QA", function () {

    //it block
    it("Make sure the title matches the given expectations", async function () {

        //launch the browser
        let driver = await new Builder().forBrowser("firefox").build();

        driver.manage().window().maximize();

        //navigate to IF application (1)
        const url = "https://www.if.lv/";
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
        await driver.findElement(By.linkText("Darbs If")).click();

        //navigate to Vakances menu (4)
        await driver.findElement(By.linkText("Vakances")).click();
        
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