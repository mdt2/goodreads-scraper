const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');

const url = 'https://www.goodreads.com/review/list/86630558-melissa-thompson?shelf=to-read';

const getWebsiteContent = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let titles = $('div.value > a[title]');
    let titleList = [];
    for (let i = 0; i < titles.length; i++) {
      titleList.push(titles[i].attribs.title);
    }
    console.log(titleList);
  } catch (error) {
    console.error(error)
  }
}

getWebsiteContent(url);
