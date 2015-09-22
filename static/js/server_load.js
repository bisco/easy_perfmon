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
                          //sys = json["all"]["%sys"];
                          //nice = json["all"]["%nice"];
                          //iowait = json["all"]["%iowait"];
                          //irq = json["all"]["%irq"];
                          //soft = json["all"]["%soft"];
                          //steal = json["all"]["%steal"];
                          //guest = json["all"]["%guest"];
                          //gnice = json["all"]["%gnice"];
                          //idle = json["all"]["%idle"];
                      } else {
                          usr = json[i-1]["%usr"];
                          //time = json[i-1]["time"];
                          //sys = json[i-1]["%sys"];
                          //nice = json[i-1]["%nice"];
                          //iowait = json[i-1]["%iowait"];
                          //irq = json[i-1]["%irq"];
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

    //(function(){
    //    // d3.js + epoch.js
    //    idx = ((new Date()).getTime()/1000)|0;
    //    var data = [
    //      { label: 'Total' , values: [ {time: idx, y: 0} ] },
    //      { label: 'User'  , values: [ {time: idx, y: 0} ] },
    //      { label: 'System', values: [ {time: idx, y: 0} ] }
    //    ];
    //    
    //    var areaChartInstance = $('#myarea').epoch({
    //        type: 'time.line',
    //        data: data,
    //        axes: ['right', 'bottom'],
    //        ticks: {time: 10, right: 10},
    //    });
    //    
    //    var idx = 3;
    //    var nextData;

    //    setInterval(function(){
    //        $.ajax({
    //            type: 'GET',
    //            url: '/json/cpu_usage',
    //            dataType: 'json',
    //            success: function(json) {
    //                user = json["total"]["user"];
    //                system = json["total"]["system"];
    //                idx = ((new Date()).getTime()/1000)|0;
    //                nextData = [
    //                    {time: idx, y: user+system}, // Total
    //                    {time: idx, y: user},        // User
    //                    {time: idx, y: system}       // System
    //                ];
    //                areaChartInstance.push(nextData);    
    //            },
    //        });
    //    },1000);
    //})();

    //(function(){
    //    // d3.js + epoch.js
    //    idx = ((new Date()).getTime()/1000)|0;
    //    var data = { label: 'Total' , values: [ {time: idx, y: 0} ] };

    //    var areaChartInstance = $('#gaugeChart').epoch({
    //        type: 'time.gauge',
    //        ticks: 10,
    //        tickSize: 5,
    //        tickOffset: 10,
    //        data: data,
    //        domain: [0,100],
    //    });
    //    
    //    var nextData;

    //    setInterval(function(){
    //        $.ajax({
    //            type: 'GET',
    //            url: '/json/cpu_usage',
    //            dataType: 'json',
    //            success: function(json) {
    //                user = json["total"]["user"];
    //                system = json["total"]["system"];
    //                idx = ((new Date()).getTime()/1000)|0;
    //                nextData = 
    //                    {time: idx, y: Math.random()*100.0};
    //                areaChartInstance.push(nextData);    
    //            },
    //        });
    //    },1000);
    //})();

});
