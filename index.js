require('dotenv').config();

const puppeteer = require('puppeteer');
const fs = require('fs');
const chalk = require('chalk');

// TO DO: Move this into a scraper-helpers file
// TO DO: Might have to add babel to do this successfully
// From https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore
const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const { scrollHeight } = document.body;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

const url = 'https://www.goodreads.com/review/list/86630558-melissa-thompson?shelf=to-read';

const error = chalk.bold.red;

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    await autoScroll(page);
    await page.waitForSelector('div.value > a[title]');

    const results = await page.evaluate(() => {
      // Variables have to live here for Chromium to interact with them
      // Variables declared outside of page.evaluate() are inaccessible
      const titles = document.querySelectorAll('div.value > a[title]');
      const titleList = [];

      for (let i = 0; i < titles.length; i++) {
        titleList.push(titles[i].getAttribute('title'));
      }

      const loadedIndicator = document.querySelector('#infiniteStatus');
      const loadedIndicatorText = loadedIndicator.innerText;
      const numbers = /\d+/g;
      const loadedNumbersList = loadedIndicatorText.match(numbers);

      // Check if all titles are loaded before returning
      // autoScroll should take care of this but this way I can throw an error if it doesn't
      // TO DO: make this error out if the condition isn't met
      if (loadedNumbersList[0] === loadedNumbersList[1]) {
        return titleList;
      }
    });

    // browser.close();

    fs.writeFile('titles.json', JSON.stringify(results, null, 2), (err) => {
      if (err) throw err;
      console.log('Titles saved!');
    });

    // Sign in to Amazon
    await page.goto('https://amazon.com/');
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
  } catch (err) {
    console.log('Script failed:', error(err));
  }
})();
