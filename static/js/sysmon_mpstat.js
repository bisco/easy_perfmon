$(function(){
    (function(){
        // smoothie.js + mpstat

        var num_of_cpus = 0;
        $.ajaxSetup({ async: false });
        $.getJSON("/json/num_of_cpus",function(data) {
            num_of_cpus = parseInt(data["num_of_cpus"],10);
        });
        $.ajaxSetup({ async: true });

        var smoothie = [];
        var line = [];
        var i,j;
        for(i=0;i<=num_of_cpus;i++) {
            smoothie.push(new SmoothieChart(
                           {timestampFormatter:SmoothieChart.timeFormatter,
                            maxValue: 100, minValue: 0, 
                            labels: {fontSize: 14},
                            grid: { sharpLines:true,strokeStyle: 'rgb(0, 125, 0)',
                            lineWidth: 1, //fillStyle: 'rgb(60, 0, 0)', 
                            millisPerLine: 1000, verticalSections: 5 },
                    }));
            line.push(new TimeSeries());
        }

        // Add a random value to each line every second
        setInterval(function() {
          $.ajax({
              type: 'GET',
              url:  '/json/mpstat',
              dataType: 'json',
              success: function(json) {
                  var i;
                  for(i=0;i<=num_of_cpus;i++) {
                      if(i == 0) {
                          usr = json["all"]["%usr"];
                          //time = json["all"]["time"];
                          sys = json["all"]["%sys"];
                          //nice = json["all"]["%nice"];
                          iowait = json["all"]["%iowait"];
                          irq = json["all"]["%irq"];
                          //soft = json["all"]["%soft"];
                          //steal = json["all"]["%steal"];
                          //guest = json["all"]["%guest"];
                          //gnice = json["all"]["%gnice"];
                          //idle = json["all"]["%idle"];
                      } else {
                          usr = json[i-1]["%usr"];
                          //time = json[i-1]["time"];
                          sys = json[i-1]["%sys"];
                          //nice = json[i-1]["%nice"];
                          iowait = json[i-1]["%iowait"];
                          irq = json[i-1]["%irq"];
                          //soft = json[i-1]["%soft"];
                          //steal = json[i-1]["%steal"];
                          //guest = json[i-1]["%guest"];
                          //gnice = json[i-1]["%gnice"];
                          //idle = json[i-1]["%idle"];
                      }
                      line[i].append(new Date().getTime(), usr);
                  }
              },
          });
        }, 1000);

        for(i=0;i<=num_of_cpus;i++) {
            smoothie[i].addTimeSeries(line[i], { strokeStyle: 'rgb(0, 255, 0)', 
                                    fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3 });
            canvas_name = "mpstat"+i;
            smoothie[i].streamTo(document.getElementById(canvas_name), 0);
        }
    })();
});

