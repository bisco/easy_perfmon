$(function(){
    (function(){
        // smoothie.js + mpstat
        var smoothie = new SmoothieChart(
                           {timestampFormatter:SmoothieChart.timeFormatter,
                            maxValue: 100, minValue: 0, 
                            labels: {fontSize: 14},
                            grid: { sharpLines:true,strokeStyle: 'rgb(0, 125, 0)',
                            lineWidth: 1, //fillStyle: 'rgb(60, 0, 0)', 
                            millisPerLine: 1000, verticalSections: 5 },
                        });
        var i;
        var param_count = 4;
        var line = [];
        for(i=0;i<param_count;i++) {
            line.push(new TimeSeries());
        }

        // Add a random value to each line every second
        setInterval(function() {
          $.ajax({
              type: 'GET',
              url:  '/json/mpstat',
              dataType: 'json',
              success: function(json) {
                      var usr = json["all"]["%usr"];
                      var sys = json["all"]["%sys"];
                      var iowait = json["all"]["%iowait"];
                      var irq = json["all"]["%irq"];
                      //nice = json["all"]["%nice"];
                      //time = json["all"]["time"];
                      //soft = json["all"]["%soft"];
                      //steal = json["all"]["%steal"];
                      //guest = json["all"]["%guest"];
                      //gnice = json["all"]["%gnice"];
                      //idle = json["all"]["%idle"];
                      var param = [usr,sys,iowait,irq];
                      var i;
                      for(i=0;i<param_count;i++) {
                          line[i].append(new Date().getTime(), param[i]);
                      }
              },
          });
        }, 1000);

        var line_color = ["rgb(0,255,0)", "rgb(255,255,0)", "rgb(255,0,255)", "rgb(0,255,255)"];
        var fill_color = ["rgba(0,255,0,0.4)", "rgba(255,255,0,0.4)", 
                          "rgba(255,0,255,0.4)", "rgba(0,255,255,0.4)"];
        for(i=0;i<param_count;i++) {
            smoothie.addTimeSeries(line[i], { strokeStyle: line_color[i], 
                                fillStyle: fill_color[i], lineWidth: 2 });
        }
        canvas_name = "mpstat_all";
        smoothie.streamTo(document.getElementById(canvas_name), 0);
    })();

    (function(){
        // smoothie.js + iostat
        var smoothie = new SmoothieChart(
                           {timestampFormatter:SmoothieChart.timeFormatter,
                            minValue: 0, 
                            labels: {fontSize: 14},
                            grid: { sharpLines:true,strokeStyle: 'rgb(0, 125, 0)',
                            lineWidth: 1, //fillStyle: 'rgb(60, 0, 0)', 
                            millisPerLine: 1000, verticalSections: 5 },
                        });

        var param_count = 2;
        var line = [];
        var i;
        for(i=0;i<param_count;i++) {
            line.push(new TimeSeries());
        }

        // Add a random value to each line every second
        setInterval(function() {
          $.ajax({
              type: 'GET',
              url:  '/json/iostat',
              dataType: 'json',
              success: function(json) {
                      var rkBs,wkBs;
                      rkBs = 0.0;
                      wkBs = 0.0;
                      for(key in json) {
                          if(key.indexOf("dm-") != -1) {
                              continue;
                          }
                          rkBs += parseFloat(json[key]["rkB/s"]);
                          wkBs += parseFloat(json[key]["wkB/s"]);
                      }
                      var param = [rkBs,wkBs];
                      for(i=0;i<param_count;i++) {
                          line[i].append(new Date().getTime(), param[i]);
                      }
              },
          });
        }, 2000);

        var line_color = ["rgb(0,255,0)", "rgb(255,255,0)", "rgb(255,0,255)", "rgb(0,255,255)"];
        var fill_color = ["rgba(0,255,0,0.4)", "rgba(255,255,0,0.4)", 
                          "rgba(255,0,255,0.4)", "rgba(0,255,255,0.4)"];
        for(i=0;i<param_count;i++) {
            smoothie.addTimeSeries(line[i], { strokeStyle: line_color[i], 
                                fillStyle: fill_color[i], lineWidth: 2 });
        }
        canvas_name = "iostat_all";
        smoothie.streamTo(document.getElementById(canvas_name), 0);
    })();

    (function(){
        var memsize = 0;
        $.ajaxSetup({ async: false });
        $.getJSON("/json/memsize",function(data) {
            memsize = parseInt(data["memsize"],10);
        });
        $.ajaxSetup({ async: true });

        // smoothie.js + vmstat
        var smoothie = new SmoothieChart(
                           {timestampFormatter:SmoothieChart.timeFormatter,
                            minValue: 0, maxValue: memsize, 
                            labels: {fontSize: 14},
                            grid: { sharpLines:true,strokeStyle: 'rgb(0, 125, 0)',
                            lineWidth: 1, //fillStyle: 'rgb(60, 0, 0)', 
                            millisPerLine: 1000, verticalSections: 5 },
                        });
        var i;
        var param_count = 4;
        var line = [];
        for(i=0;i<param_count;i++) {
            line.push(new TimeSeries());
        }

        // Add a random value to each line every second
        setInterval(function() {
          $.ajax({
              type: 'GET',
              url:  '/json/vmstat',
              dataType: 'json',
              success: function(json) {
                      var swpd = json["swpd"];
                      var free = json["free"];
                      var buff = json["buff"];
                      var cache = json["cache"];
                      var param = [swpd,free, buff,cache];
                      var i;
                      for(i=0;i<param_count;i++) {
                          line[i].append(new Date().getTime(), param[i]);
                      }
              },
          });
        }, 1000);

        var line_color = ["rgb(0,255,0)", "rgb(255,255,0)", "rgb(255,0,255)", "rgb(0,255,255)"];
        var fill_color = ["rgba(0,255,0,0.4)", "rgba(255,255,0,0.4)", 
                          "rgba(255,0,255,0.4)", "rgba(0,255,255,0.4)"];
        for(i=0;i<param_count;i++) {
            smoothie.addTimeSeries(line[i], { strokeStyle: line_color[i], 
                                fillStyle: fill_color[i], lineWidth: 2 });
        }
        canvas_name = "vmstat_all";
        smoothie.streamTo(document.getElementById(canvas_name), 0);
    })();


});
