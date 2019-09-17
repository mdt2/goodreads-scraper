const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const chalk = require('chalk');

const url = 'https://www.goodreads.com/review/list/86630558-melissa-thompson?shelf=to-read';

const error = chalk.bold.red;
const success = chalk.keyword("green");

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: 'example.png' });
    await browser.close();
    console.log(success("Browser Closed"));
  } catch (err) {
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
  }
})();

// const getWebsiteContent = async (url) => {
//   try {
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);

//     let titles = $('div.value > a[title]');
//     let titleList = [];
//     for (let i = 0; i < titles.length; i++) {
//       titleList.push(titles[i].attribs.title);
//     }
//     console.log(titleList);
//   } catch (error) {
//     console.error(error)
//   }
// }

// getWebsiteContent(url);
