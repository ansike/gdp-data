const fs = require("fs");
const cheerio = require("cheerio");
const { getHtmlData } = require("./util");

async function main(url) {
  return new Promise(async (resolve, reject) => {
    const text = await getContent(url);
    console.log(url);
    const year = text.match(/([\d]{4})年/)[1];
    const allData = text.match(
      /全年国内生产总值(?:为)?(?:\[\d+\])?([\d]+亿元)/i
    )?.[1];
    const data = {
      url,
      year,
      allData,
    };
    resolve(data);
  });
}

async function getContent(url) {
  // 获取列表页dom
  const listStr = await getHtmlData(url);
  const listDom = cheerio.load(listStr);
  const children = listDom(".center_xilan");
  return children.text();
}

module.exports = main;
