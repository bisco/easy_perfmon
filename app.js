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
var child = child_process.fork("./cpu_usage");
var cpu_usage;
child.on("message", function (msg) {
  cpu_usage = msg;
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
        memsize: os.totalmem() / 1024
      }
    );
});

app.get("/json/num_of_cpus", function(req, res) {
  res.contentType('application/json');
  var num_of_cpus = {num_of_cpus: Object.keys(os.cpus()).length};
  res.send(JSON.stringify(num_of_cpus));
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
  var total = user = sys = nice = idle = irq = 0;

  for(var i=0;i<Object.keys(os.cpus()).length;i++) {
    user += cpu_usage["user"][i];
    sys  += cpu_usage["sys"][i];
    nice += cpu_usage["nice"][i];
    idle += cpu_usage["idle"][i];
    irq  += cpu_usage["irq"][i];
    total += (user + sys + nice + idle + irq);
  }
  user = Math.round(10000 * user / total) / 100;
  sys  = Math.round(10000 *  sys / total) / 100;
  idle = Math.round(10000 * idle / total) / 100;
  res.send(JSON.stringify({user:user, sys:sys, idle:idle}));
}); 


app.listen(3000);
