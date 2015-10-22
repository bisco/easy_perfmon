var async = require('async');
var os = require("os");
var cpus = os.cpus();
var num_of_cpus = Object.keys(cpus).length;
var usr = [], sys = [], irq = [], idle = [], nice = [];
var usr_prev = [], sys_prev = [], irq_prev = [], idle_prev = [], nice_prev = [];

for(var i=0;i<num_of_cpus;i++) {
  usr.push(0);
  sys.push(0);
  irq.push(0);
  idle.push(0);
  nice.push(0);
  usr_prev.push(0);
  sys_prev.push(0);
  irq_prev.push(0);
  idle_prev.push(0);
  nice_prev.push(0);
}

async.forever(function(callback) {
  async.series([
    function(callback) {
      cpus = os.cpus();
      for(i=0;i<num_of_cpus;i++) {
        usr_prev[i]  = cpus[i]["times"]["user"];
        sys_prev[i]  = cpus[i]["times"]["sys"];
        idle_prev[i] = cpus[i]["times"]["idle"];
        irq_prev[i]  = cpus[i]["times"]["irq"];
        nice_prev[i] = cpus[i]["times"]["nice"];
      }
      setTimeout(callback, 1000);
    },
    function(callback) {
      cpus = os.cpus();
      for(i=0;i<num_of_cpus;i++) {
        usr[i]  = cpus[i]["times"]["user"] - usr_prev[i];
        sys[i]  = cpus[i]["times"]["sys"]  - sys_prev[i];
        idle[i] = cpus[i]["times"]["idle"] - idle_prev[i];
        irq[i]  = cpus[i]["times"]["irq"]  - irq_prev[i];
        nice[i] = cpus[i]["times"]["nice"] - nice_prev[i];
      }
      process.send({user:usr, sys:sys, irq:irq, idle:idle, nice:nice});
      setTimeout(callback, 1000);
    },
    ], callback);
}, function(err) {
  console.log(err);
});


