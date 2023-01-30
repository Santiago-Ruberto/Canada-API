const puppeteer = require("puppeteer");
const autoScroll = require("./scroll.js");
const fs = require("fs");
const response = require("../utils/response"),
  httpStatus = require("http-status");

module.exports = async (req, res) => {
  await dafiti();
  return response(res, httpStatus.OK, "Data Scrapped successfully");
};

async function dafiti() {
  console.log("Scrapping Dafiti");

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
  });

  const dafitiPage = await browser.newPage();

  await dafitiPage.goto("https://www.dafiti.com.ar/");
  const dafHrefs = await dafitiPage.evaluate(() => {
    let urls = Array.from(document.getElementsByTagName("a"), (a) => a.href);
    return urls;
  });

  let jsonData = {};
  let key = "dafiti";

  console.log("dafiti length", dafHrefs.length);

  jsonData[key] = [];

  for (let i = 13; i < dafHrefs.length; i++) {
    const tabDaf = await browser.newPage();
    await tabDaf.goto(dafHrefs[i], {
      waitUntil: "load",
    });

    var dafCatPage = (await tabDaf.$("div.catalog-products")) !== null;
    if (dafCatPage) {
      var dafLastPage = true;
      const dpro = [];
      while (dafLastPage) {
        await tabDaf.waitForSelector("span.icon.icon-arrow-right-full");
        await autoScroll(tabDaf);

        const dp = await tabDaf.evaluate(() => {
          var prods = document.querySelectorAll(
            ".productsCatalog .itm-product-main-info"
          );
          var pdata = [];
          var proPage = document.querySelector(".card-content.itm.last");
          for (let k = 0; k < prods.length; k++) {
            var oneProDaf = [];
            // get title
            var title = prods[k].querySelector(".itm-title").innerText;
            // get the link
            var link = prods[k].querySelector(".itm-link").getAttribute("href");
            // get photo
            var photo = prods[k].querySelector(".itm-img").getAttribute("src");
            // get price
            var price = prods[k].querySelector(".discount-price").innerText;
            // get brand
            var brand = "from Dafiti";

            var payload = {
              name: title,
              link: link,
              photo: photo,
              price: price.replace(/\s+/g, "").replace("$", ""),
              description: brand,
            };

            //jsonData[key].push(payload);
            pdata.push(payload);
          }
          return pdata;
        });

        jsonData[key].push(...dp);
        fs.writeFile(
          "./productData.json",
          JSON.stringify(jsonData),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log(
              `The data was saved!! Remaining pages:${dafHrefs.length - i}`
            );
          }
        );

        const is_disabled =
          (await tabDaf.$("span.icon.icon-arrow-right-full")) !== null;
        dafLastPage = is_disabled;
        if (is_disabled) await tabDaf.click("span.icon.icon-arrow-right-full");
      }
    }
    await tabDaf.close();
  }

  await dafitiPage.close();
  await browser.close();
}
