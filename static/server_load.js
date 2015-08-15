$(function(){
    (function(){
        // smoothie.js
        // Data
        var line1 = new TimeSeries();
        var line2 = new TimeSeries();
        // Add a random value to each line every second
        setInterval(function() {
          $.ajax({
              type: 'GET',
              url:  '/json/cpu_usage',
              dataType: 'json',
              success: function(json) {
                  user = json["total"]["user"];
                  system = json["total"]["system"];
                  line1.append(new Date().getTime(), user);
                  line2.append(new Date().getTime(), system);
              },
          });
        }, 1000);

        // Add to SmoothieChart
        var smoothie = new SmoothieChart(
                           {timestampFormatter:SmoothieChart.timeFormatter,
                            maxValue: 100, minValue: 0, 
                            labels: {fontSize: 14},
                            grid: { sharpLines:true,strokeStyle: 'rgb(0, 125, 0)',
                            lineWidth: 1, //fillStyle: 'rgb(60, 0, 0)', 
                            millisPerLine: 1000, verticalSections: 5 },
                      });
        smoothie.addTimeSeries(line1, { strokeStyle: 'rgb(0, 255, 0)', 
                                        fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3 });
        smoothie.addTimeSeries(line2, { strokeStyle: 'rgb(255, 0, 255)', 
                                        fillStyle: 'rgba(255, 0, 255, 0.3)', lineWidth: 3 });
        smoothie.streamTo(document.getElementById("mycanvas"), 0);
    })();

    (function(){
        // d3.js + epoch.js
        idx = ((new Date()).getTime()/1000)|0;
        var data = [
          { label: 'Total' , values: [ {time: idx, y: 0} ] },
          { label: 'User'  , values: [ {time: idx, y: 0} ] },
          { label: 'System', values: [ {time: idx, y: 0} ] }
        ];
        
        var areaChartInstance = $('#myarea').epoch({
            type: 'time.line',
            data: data,
            axes: ['right', 'bottom'],
            ticks: {time: 10, right: 10},
        });
        
        var idx = 3;
        var nextData;

        setInterval(function(){
            $.ajax({
                type: 'GET',
                url: '/json/cpu_usage',
                dataType: 'json',
                success: function(json) {
                    user = json["total"]["user"];
                    system = json["total"]["system"];
                    idx = ((new Date()).getTime()/1000)|0;
                    nextData = [
                        {time: idx, y: user+system}, // Total
                        {time: idx, y: user},        // User
                        {time: idx, y: system}       // System
                    ];
                    areaChartInstance.push(nextData);    
                },
            });
        },1000);
    })();

    (function(){
        // d3.js + epoch.js
        idx = ((new Date()).getTime()/1000)|0;
        var data = { label: 'Total' , values: [ {time: idx, y: 0} ] };

        var areaChartInstance = $('#gaugeChart').epoch({
            type: 'time.gauge',
            ticks: 10,
            tickSize: 5,
            tickOffset: 10,
            data: data,
            domain: [0,100],
        });
        
        var nextData;

        setInterval(function(){
            $.ajax({
                type: 'GET',
                url: '/json/cpu_usage',
                dataType: 'json',
                success: function(json) {
                    user = json["total"]["user"];
                    system = json["total"]["system"];
                    idx = ((new Date()).getTime()/1000)|0;
                    nextData = 
                        {time: idx, y: Math.random()*100.0};
                    areaChartInstance.push(nextData);    
                },
            });
        },1000);
    })();

});
