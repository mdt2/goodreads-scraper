require('dotenv').config();

const puppeteer = require('puppeteer');

const url = 'https://amazon.com/';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    // await page.click('#nav-link-accountList');
    // await page.waitForSelector('.nav-action-button');
    // await page.click('.nav-action-button');
    // await page.waitForSelector('#ap_email');
    // await page.type('#ap_email', process.env.AMAZONUSER);
    // await page.click('#continue');

    // Code to search amazon is working
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
