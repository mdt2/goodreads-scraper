require('dotenv').config();

const puppeteer = require('puppeteer');

const url = 'https://amazon.com/';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

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
    await page.type('#twotabsearchtextbox', 'Managing Oneself');
    await page.click('input.nav-input');
    await page.waitForSelector('.s-result-list');
    const links = await page.$$('a.a-link-normal.a-text-normal');
    await links[3].click();

    // browser.close();
  } catch (err) {
    console.log(err);
    // browser.close();
  }
})();
