const http = require("http");
const fs = require("fs");
const cheerio = require("cheerio");

const HOST = "http://www.stats.gov.cn";

main();

async function main() {
  const [d1, d2, d3] = await Promise.all([
    getList("http://www.stats.gov.cn/tjsj/tjgb/ndtjgb/"),
    getList("http://www.stats.gov.cn/tjsj/tjgb/ndtjgb/index_1.html"),
    getList("http://www.stats.gov.cn/tjsj/tjgb/ndtjgb/index_2.html"),
  ]);
  const data = [...d1, ...d2, ...d3];
  fs.writeFile(
    "gdp.json",
    JSON.stringify(data, null, '\t'),
    { encoding: "utf-8" },
    (err) => {
      console.log(err);
    }
  );
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
  return links;
}

function getHtmlData(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("error", (d) => {
        reject(d);
      });

      res.on("data", (d) => {
        data += d;
      });

      res.on("end", () => {
        resolve(data);
      });
    });
  });
}
