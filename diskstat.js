var filename = "/proc/diskstats"
var fs = require("fs");
var async = require('async');
var r_bytes = 0, w_bytes = 0;
var diskstats;

function total_iostat(fs, filename) {
  var diskstats = fs.readFileSync(filename,"utf-8").trim().split("\n");
  var r_bytes = 0, w_bytes = 0;
  diskstats.forEach(function(line) {
    diskstat = line.trim().replace(/ +/g,' ').split(" ");
    if(diskstat[2].match(/^sd[a-z]+$/)) {
      r_bytes += parseInt(diskstat[5],10);
      w_bytes += parseInt(diskstat[9],10);
    }
  });
  return {r_bytes: r_bytes, w_bytes: w_bytes};
}

var iostat;

async.forever(function(callback) {
  async.series([
    function(callback) {
      iostat = total_iostat(fs,filename);
      r_bytes = iostat["r_bytes"];
      w_bytes = iostat["w_bytes"];
      setTimeout(callback, 1000);
    },
    function(callback) {
      iostat = total_iostat(fs,filename);
      r_bytes = iostat["r_bytes"] - r_bytes;
      w_bytes = iostat["w_bytes"] - w_bytes;
      process.send({"rbytes_s":r_bytes, "wbytes_s": w_bytes});
      setTimeout(callback, 1000);
    }
  ],callback);
}, function(err) {
  console.log(err);
});

