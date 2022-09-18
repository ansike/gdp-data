const fs = require("fs");
const cheerio = require("cheerio");
const { getHtmlData } = require("./util");

async function main(url) {
  return new Promise(async (resolve, reject) => {
    const text = await getContent(url);
    console.log(url);
    const year = text.match(/([\d]{4})年/)[1];
    const currentGdp = text.match(
      /全年国内生产总值(?:为)?(?:\[\d+\])?([\d]+亿元)/i
    )?.[1];
    const increasePercent = text.match(/比上年增长([\d.]+%)/)?.[1];
    const firstIndustryIncreasePercent =
      text.match(/第一产业增长([\d.]+%)/)?.[1] ||
      text.match(/第一产业增加值\d+亿元，(?:比上年)?增长([\d.]+%)/)?.[1];
    const secondIndustryIncreasePercent =
      text.match(/第二产业增长([\d.]+%)/)?.[1] ||
      text.match(/第二产业增加值\d+亿元，(?:比上年)?增长([\d.]+%)/)?.[1];
    const thirdIndustryIncreasePercent =
      text.match(/第三产业增长([\d.]+%)/)?.[1] ||
      text.match(/第三产业增加值\d+亿元，(?:比上年)?增长([\d.]+%)/)?.[1];

    const data = {
      url,
      year,
      currentGdp,
      increasePercent,
      firstIndustryIncreasePercent,
      secondIndustryIncreasePercent,
      thirdIndustryIncreasePercent,
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
