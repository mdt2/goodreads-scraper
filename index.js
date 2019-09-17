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
    await page.waitForSelector('div.value > a[title]');

    const results = await page.evaluate(() => {
      // Vars have to live here for Chromium to interact with them
      // Vars declared outside of page.evaluate() are inaccessible
      let titles = document.querySelectorAll('div.value > a[title]');
      let nextPage = document.querySelectorAll('.next_page');
      let titleList = [];

      for (let i = 0; i < titles.length; i++) {
        titleList.push(titles[i].getAttribute('title'));
      }

      console.log(titleList);
      return titleList;

    });

    await browser.close();

    fs.writeFile('titles.json', JSON.stringify(results), (err) => {
      if (err) throw err;
      console.log('Saved!');
    });

    console.log("Brwoser Closed");
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
