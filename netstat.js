var filename = "/proc/net/dev"
var fs = require("fs");
var async = require('async');
var r_bytes = 0, w_bytes = 0;
var stats;

function total_stat(fs, filename) {
  var stats = fs.readFileSync(filename,"utf-8").trim().split("\n");
  var r_bytes = 0, w_bytes = 0;
  var count = 0;
  stats.forEach(function(line) {
    stat = line.trim().replace(/ +/g,' ').split(" ");
    count += 1;
    if(count < 2) return;
    stat[0] = stat[0].replace(/:/g, '').trim();
    if(!stat[0].match(/^(Inter|lo|bond\d+|face|.+\.\d+)$/)) {
      r_bytes += parseInt(stat[1],10);
      w_bytes += parseInt(stat[9],10);
    }
  });
  return {r_bytes: r_bytes, w_bytes: w_bytes};
}

var stat;

async.forever(function(callback) {
  async.series([
    function(callback) {
      stat = total_stat(fs,filename);
      r_bytes = stat["r_bytes"];
      w_bytes = stat["w_bytes"];
      setTimeout(callback, 1000);
    },
    function(callback) {
      stat = total_stat(fs,filename);
      r_bytes = stat["r_bytes"] - r_bytes;
      w_bytes = stat["w_bytes"] - w_bytes;
      process.send({"rbytes_s":r_bytes, "wbytes_s": w_bytes});
      setTimeout(callback, 1000);
    }
  ],callback);
}, function(err) {
  console.log(err);
});

