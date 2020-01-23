require('dotenv').config();

const puppeteer = require('puppeteer');

const url = 'https://amazon.com/';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Sign in to Amazon
    await page.goto(url);
    await page.click('#nav-link-accountList');
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', process.env.AMAZONUSER);
    await page.click('#continue');
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', process.env.AMAZONPASS);
    await page.click('#signInSubmit');

    // Search Amazon
    await page.waitForSelector('#twotabsearchtextbox');
    await page.type('#twotabsearchtextbox', 'Managing Oneself');
    await page.click('input.nav-input');
    await page.waitForSelector('div.s-result-list');
    const links = await page.$$('a.a-link-normal.a-text-normal');
    await links[0].click();

    // Add item to Wish List
    await page.waitForSelector('input#add-to-wishlist-button');
    await page.click('input#add-to-wishlist-button');
    await page.waitForSelector('span#atwl-list-name-2XQOCHIMITAVA');
    await page.click('span#atwl-list-name-2XQOCHIMITAVA');

    // browser.close();
  } catch (err) {
    console.log(err);
    // browser.close();
  }
})();
