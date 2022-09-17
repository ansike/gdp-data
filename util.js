const http = require("http");
const zlib = require("zlib");

class Limit {
  queue = [];
  _max = 8;
  _count = 0;
  constructor(limit) {
    this._max = limit || 8;
    this._count = 0;
  }
  call(caller, ...args) {
    return new Promise((resolve, reject) => {
      const task = this._createTask(caller, args, resolve, reject);
      if (this._count >= this._max) {
        this.queue.push(task);
      } else {
        this._count++;
        task();
      }
    });
  }
  _createTask(caller, args, resolve, reject) {
    return () => {
      caller(...args)
        .then((val) => {
          resolve(val);
        })
        .catch((e) => reject(e))
        .finally(() => {
          this._count--;
          const task = this.queue.shift();
          if (task) {
            this._count++;
            task();
          }
        });
    };
  }
}

function getHtmlData(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = Buffer.alloc(0);
      res.on("error", (d) => {
        reject(d);
      });

      res.on("data", (d) => {
        data = Buffer.concat([data, d], data.length + d.length);
      });

      res.on("end", () => {
        if (res.headers["content-encoding"] === "gzip") {
          data = zlib.unzipSync(data);
        }
        resolve(data.toString());
      });
    });
  });
}

module.exports = {
  getHtmlData,
  Limit
};
