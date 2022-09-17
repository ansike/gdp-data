const http = require("http");
const cheerio = require("cheerio");
const fs = require("fs");
const getGdpLinks = require("./getGdpLinks");
const getGdpData = require("./getGdpData");
const { Limit } = require("./util");

const HOST = "http://www.stats.gov.cn";

main();

async function main() {
  const isExit = fs.existsSync("./gdp.json");
  if (!isExit) {
    await getGdpLinks();
  }
  const gdpLinks = require("./gdp.json");
  const limit = new Limit(4);
  const all = await Promise.all(
    gdpLinks.map((link) => limit.call(getGdpData, link))
  );
  const sortData = all.sort((a, b) => a.year - b.year);
  fs.writeFile(
    "gdpall.json",
    JSON.stringify(sortData, null, "\t"),
    { encoding: "utf-8" },
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
}
