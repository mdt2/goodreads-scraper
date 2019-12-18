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
    await autoScroll(page);
    await page.waitForSelector('div.value > a[title]');

    const results = await page.evaluate(() => {
      // Vars have to live here for Chromium to interact with them
      // Vars declared outside of page.evaluate() are inaccessible
      let titles = document.querySelectorAll('div.value > a[title]');
      let titleList = [];

      for (let i = 0; i < titles.length; i++) {
        titleList.push(titles[i].getAttribute('title'));
      }

      return titleList;
    });

    browser.close();

    fs.writeFile('titles.json', JSON.stringify(results, null, 2), (err) => {
      if (err) throw err;
      console.log('Titles saved!');
    });
  } catch (err) {
    console.log(error(err));
    await browser.close();
  }
})();

// From https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore
const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}


// const scrape = async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.goto(url);

//   let titleList = [];
//   const numberOfPages = 7; // change to dynamic if this works
//   // const nextPage = document.querySelectorAll('.next_page');

//   for (let i = 0; i < numberOfPages; i++) {
//     await page.waitForSelector('div.value > a[title]');
//     titleList = titleList.concat(await getTitlesOnPage(page));

//     if (i != numberOfPages - 1) {
//       await page.click('.next_page');
//     }
//   }

//   browser.close();
//   return results;
// };

// const getTitlesOnPage = async (page) => {
//   return page.evaluate(() => {
//     let data = [];
//     const titles = document.querySelectorAll('div.value > a[title]');

//     for (let i = 0; i < titles.length; i++) {
//       data.push(titles[i].getAttribute('title'));
//     }

//     console.log('evaluated');
//     return data;
//   });
// }

// const organizeTitles = () => {
//   fs.writeFile('titles.json', JSON.stringify(results, null, 2), (err) => {
//     if (err) throw err;
//     console.log('Titles organized!');
//   });
// }

// scrape().then((value) => {
//   console.log(value);
//   console.log('Scraped!');
// })


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
