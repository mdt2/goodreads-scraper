const cheerio = require('cheerio');
const $ = cheerio.load('<a title="My book title"></a><a title="one more of My book title"></a>');
let titles = $('a[title]');
const titleList = [];

for (let i = 0; i < titles.length; i++) {
  titleList.push(titles[i].attribs.title);
  console.log(titleList);
}
