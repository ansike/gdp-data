const fs = require("fs");
const cheerio = require("cheerio");
const { getHtmlData } = require("./util");

const HOST = "http://www.stats.gov.cn";

async function main() {
  return new Promise(async (resolve, reject) => {
    const [d1, d2, d3] = await Promise.all([
      getList("http://www.stats.gov.cn/tjsj/tjgb/ndtjgb/"),
      getList("http://www.stats.gov.cn/tjsj/tjgb/ndtjgb/index_1.html"),
      getList("http://www.stats.gov.cn/tjsj/tjgb/ndtjgb/index_2.html"),
    ]);
    const data = [...d1, ...d2, ...d3];
    fs.writeFile(
      "gdp.json",
      JSON.stringify(data, null, "\t"),
      { encoding: "utf-8" },
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
}

async function getList(url) {
  // 获取列表页dom
  const listStr = await getHtmlData(url);
  const listDom = cheerio.load(listStr);
  const children = listDom(".center_list_contlist a");
  const links = Array.from(children)
    .map((item) => {
      return item?.attributes?.[0].value;
    })
    .filter((it) => it && it.includes(".html"));
  return links.map((link) => {
    return link
      .replace(/^\//, HOST + "/")
      .replace(/^\.\//, HOST + "/tjsj/tjgb/ndtjgb/");
  });
}

module.exports = main;
