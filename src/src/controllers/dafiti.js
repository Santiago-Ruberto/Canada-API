const puppeteer = require("puppeteer");
const autoScroll = require("./scroll.js");

async function dafiti() {
  console.log("kekke");
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
  });

  console.log("started *.*");
  /*
   *      this is for website of dafiti
   */

  const dafitiPage = await browser.newPage();

  await dafitiPage.goto("https://www.dafiti.com.ar/");
  const dafHrefs = await dafitiPage.evaluate(() => {
    let urls = Array.from(document.getElementsByTagName("a"), (a) => a.href);
    return urls;
  });

  var dafitiProducts = [];
  console.log(dafHrefs.length);
  for (let i = 13; i <= 15; i++) {
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

            oneProDaf = [
              "title: " + title,
              "link: " + link,
              "photo: " + photo,
              "price: " + price,
              "Brand or page where the product comes from: " + brand,
            ];
            pdata.push(oneProDaf);
          }
          return pdata;
        });
        dpro.push(dp);
        console.log(dp);
        const is_disabled =
          (await tabDaf.$("span.icon.icon-arrow-right-full")) !== null;
        dafLastPage = is_disabled;
        if (is_disabled) await tabDaf.click("span.icon.icon-arrow-right-full");
      }
      dafitiProducts.push(dpro);
    }
    await tabDaf.close();
  }
  await dafitiPage.close();
  await browser.close();
}

dafiti();
