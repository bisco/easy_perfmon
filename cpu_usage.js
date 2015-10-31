var async = require('async');
var os = require("os");

var _FILENAME = "/proc/stat"
var _NUM_OF_CPUS = Object.keys(os.cpus()).length;
var _STAT_COL_NAME = ["user","nice","system","idle",
                      "iowait","irq","softirq","steal",
                      "guest","guest_nice"];

function get_stat(filename) {
  var fs = require("fs");
  var stats = fs.readFileSync(filename, "utf-8").trim().split("\n");
  var result = []
  stats.forEach(function(line) {
    if(line.match(/cpu/)) {
      cpustat = line.trim().replace(/ +/,' ').split(" ");
      result.push([]);
      var tail_idx = result.length - 1;
      for(var i=0; i<_STAT_COL_NAME.length; i++) {
        result[tail_idx].push(parseInt(cpustat[i+1],10));
      }
    }
  });
  return result;
}

var cur = [], prev = [];
async.forever(function(callback) {
  async.series([
    function(callback) {
      prev = get_stat(_FILENAME);
      setTimeout(callback, 1000);
    },
    function(callback) {
      cur = get_stat(_FILENAME);
      var msg = {}
      var total;
      var i,j;
      for(i=0; i<cur.length; i++) {
        total = 0;
        for(j=0; j<_STAT_COL_NAME.length; j++) {
          if(i === 0) msg[_STAT_COL_NAME[j]] = [];
          msg[_STAT_COL_NAME[j]].push(cur[i][j]-prev[i][j]);
          total += (cur[i][j]-prev[i][j]);
        };
        for(j=0; j<_STAT_COL_NAME.length; j++) {
          msg[_STAT_COL_NAME[j]][i] = Math.round((10000 * msg[_STAT_COL_NAME[j]][i] / total)) / 100;
        }
      }
      process.send(msg);
      setTimeout(callback, 1000);
    },
    ], callback);
}, function(err) {
  console.log(err);
});


