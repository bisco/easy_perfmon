var async = require('async');
var os = require("os");

var _FILENAME = "/proc/meminfo"

function get_stat(filename) {
  var fs = require("fs");
  var stats = fs.readFileSync(filename, "utf-8").trim().split("\n");
  var result = {}
  stats.forEach(function(line) {
    meminfo = line.trim().replace(/:/,'').replace(/ +/,' ').split(" ");
    for(var i=0; i<meminfo.length; i++) {
      result[meminfo[0]] = parseInt(meminfo[1], 10);
    }
  });
  return result;
}

var msg;
async.forever(function(callback) {
  async.series([
    function(callback) {
      msg = get_stat(_FILENAME);
      msg["MemUsed"] = msg["MemTotal"] - msg["MemFree"] - msg["Buffers"] - msg["Cached"] - msg["SReclaimable"] + msg["Shmem"]
      process.send(msg);
      setTimeout(callback, 1000);
    },
    ], callback);
}, function(err) {
  console.log(err);
});


