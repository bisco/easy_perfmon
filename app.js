var express = require("express"),
    morgan = require("morgan"),
    stylus = require("stylus"),
    nib = require('nib'),
    os = require("os");

var app = express();
function compile(str, path) {
    return stylus(str)
        .set("filename",path)
        .use(nib());
}

var child_process = require("child_process");
var child_cpuusage = child_process.fork("./cpu_usage");
var child_diskstat = child_process.fork("./diskstat");
var child_netstat = child_process.fork("./netstat");

function get_zerofill_array(size) {
  var array = [];
  for(var i=0; i<size; i++) array.push(0);
  return array;
}

// init cpu_usage
var _STAT_COL_NAME = ["user","nice","system","idle",           
                      "iowait","irq","softirq","steal",        
                      "guest","guest_nice"];
var _NUM_OF_CPUS = Object.keys(os.cpus()).length; 
var cpu_usage = {};
for(var i=0; i<_STAT_COL_NAME.length ;i++) {
  cpu_usage[_STAT_COL_NAME[i]] = get_zerofill_array(_NUM_OF_CPUS+1);
}

child_cpuusage.on("message", function (msg) {
  cpu_usage = msg;
});


// init diskstat_total
var diskstat_total = {r_bytes:0, w_bytes:0}
child_diskstat.on("message", function (msg) {
  diskstat_total = msg;
});

// init netstat_total
var netstat_total = {r_bytes:0, w_bytes:0}
child_netstat.on("message", function (msg) {
  netstat_total = msg;
});

app.set("views", __dirname+"/views"); app.set("view engine","jade");
app.use(morgan("short"));
app.use(stylus.middleware(
            {src: __dirname + "/public", compile: compile}
        ));
app.use(express.static(__dirname + "/public"))

app.get("/", function(req, res){
    res.render('index', 
      {
        current: "Overview", 
        hostname: os.hostname(), 
        kernel_ver: os.release(), 
        memsize: os.totalmem() / 1024,
        cpu_type: (os.cpus()[0]["model"]).replace(/ +/, " "),
        num_of_cpus: os.cpus().length
      }
    );
});

app.get("/json/num_of_cpus", function(req, res) {
  res.contentType('application/json');
  var num_of_cpus = {num_of_cpus: os.cpus().length};
  res.send(JSON.stringify(num_of_cpus));
}); 

app.get("/json/cpu_model", function(req, res) {
  res.contentType('application/json');
  var cpu_model = {cpu_model: os.cpus()[0]["model"]};
  res.send(JSON.stringify(cpu_model));
}); 

app.get("/json/memsize", function(req, res) {
  res.contentType('application/json');
  var memsize = {memsize: os.totalmem()};
  res.send(JSON.stringify(memsize));
}); 

app.get("/json/mpstat", function(req, res) {
  res.contentType('application/json');
  res.send(JSON.stringify(cpu_usage));
}); 

app.get("/json/mpstat_total", function(req, res) {
  res.contentType('application/json');
  cpu_usage_total = {};
  for(var i=0; i<_STAT_COL_NAME.length; i++) {
    cpu_usage_total[_STAT_COL_NAME[i]] = cpu_usage[_STAT_COL_NAME[i]][0];
  }
  res.send(JSON.stringify(cpu_usage_total));
}); 

app.get("/json/loadavg", function(req, res) {
  res.contentType('application/json');
  loadavg = os.loadavg();
  res.send(JSON.stringify({"1min": loadavg[0], "5min": loadavg[1], "15min": loadavg[2]}));
}); 

app.get("/json/diskstat_total", function(req, res) {
  res.send(JSON.stringify(diskstat_total));
}); 

app.get("/json/netstat_total", function(req, res) {
  res.send(JSON.stringify(netstat_total));
}); 



app.listen(3000);
