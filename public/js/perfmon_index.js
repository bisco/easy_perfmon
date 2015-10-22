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

        setInterval(function() {
          $.ajax({
              type: 'GET',
              url:  '/json/mpstat_total',
              dataType: 'json',
              success: function(json) {
                      var usr = json["user"];
                      var sys = json["sys"];
                      var idle = json["idle"];
                      var param = [usr,sys,idle];
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
                                fillStyle: fill_color[i], lineWidth: 3 });
        }
        canvas_name = "mpstat_total";
        smoothie.streamTo(document.getElementById(canvas_name), 0);
    })();

    (function(){
        // smoothie.js + loadavg
        var smoothie = new SmoothieChart(
                           {timestampFormatter:SmoothieChart.timeFormatter,
                            //maxValue: 100, 
                            minValue: 0, 
                            labels: {fontSize: 14},
                            grid: { sharpLines:true,strokeStyle: 'rgb(0, 125, 0)',
                            lineWidth: 1, //fillStyle: 'rgb(60, 0, 0)', 
                            millisPerLine: 1000, verticalSections: 5 },
                        });

        var param_count = 3;
        var line = [];
        var i;
        for(i=0;i<param_count;i++) {
            line.push(new TimeSeries());
        }

        setInterval(function() {
          $.ajax({
              type: 'GET',
              url:  '/json/loadavg',
              dataType: 'json',
              success: function(json) {
                      var _1min,_5min_15min;
                      var param = [json["1min"],json["5min"], json["15min"]]
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
                                fillStyle: fill_color[i], lineWidth: 3 });
        }
        canvas_name = "loadavg";
        smoothie.streamTo(document.getElementById(canvas_name), 0);
    })();

    (function(){
        // smoothie.js + diskstat
        var smoothie = new SmoothieChart(
                           {timestampFormatter:SmoothieChart.timeFormatter,
                            //maxValue: 100, 
                            minValue: 0, 
                            labels: {fontSize: 14},
                            grid: { sharpLines:true,strokeStyle: 'rgb(0, 125, 0)',
                            lineWidth: 1, //fillStyle: 'rgb(60, 0, 0)', 
                            millisPerLine: 1000, verticalSections: 5 },
                        });
        var i;
        var param_count = 2;
        var line = [];
        for(i=0;i<param_count;i++) {
            line.push(new TimeSeries());
        }

        setInterval(function() {
          $.ajax({
              type: 'GET',
              url:  '/json/diskstat_total',
              dataType: 'json',
              success: function(json) {
                      var rBs = json["rbytes_s"];
                      var wBs = json["wbytes_s"];
                      var param = [rBs, wBs];
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
                                fillStyle: fill_color[i], lineWidth: 3 });
        }
        canvas_name = "diskstat_total";
        smoothie.streamTo(document.getElementById(canvas_name), 0);
    })();


});
