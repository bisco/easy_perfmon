$(function(){
  (function(){
    // We use an inline data source in the example, usually data would
    // be fetched from a server
    var usr = [],sys = [], idle = [];
    var placeholder = "#mpstat_total"
    var legend_placeholder = "#mpstat_legend"
    var _TOTAL_POINTS = 50;
    function get_data() {
      $.getJSON(
        "json/mpstat_total",
        function(json) {
          if(usr.length > _TOTAL_POINTS) {
            usr = usr.slice(1);
          } 
          if(sys.length > _TOTAL_POINTS) {
            sys = sys.slice(1);
          }
          if(idle.length > _TOTAL_POINTS) {
            idle = idle.slice(1);
          }
          var t = (new Date()).getTime();
          usr.push([t, json.user]);
          sys.push([t, json.sys]);
          idle.push([t, json.idle]);
        }
      );
    }

    // Set up the control widget
    var updateInterval = 1000;
    $("#updateInterval").val(updateInterval).change(function () {
      var v = $(this).val();
      if (v && !isNaN(+v)) {
        updateInterval = +v;
        if (updateInterval < 1) {
          updateInterval = 1;
        } else if (updateInterval > 2000) {
          updateInterval = 2000;
        }
        $(this).val("" + updateInterval);
      }
    });

    // Set up plot
    var plot = $.plot(placeholder, [{label:"usr",data:usr},{label:"sys",data:sys},{label:"idle", data:idle}], {
      series: { shadowSize: 0 },
      yaxis: {
        min: 0,
        max: 100,                          
        tickFormatter: function (v, axis) {
          if (v % 10 == 0) {
            return v + "%";
          } else {
            return "";
          }
        },
        axisLabel: "CPU usage",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: 'Verdana, Arial',
        axisLabelPadding: 6,
      },
      xaxis: { 
        mode: "time",
        tickSize: [2, "second"],
        tickFormatter: function (v, axis) {
          var date = new Date(v);

          if (date.getSeconds() % 20 == 0) {
            var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

            return hours + ":" + minutes + ":" + seconds;
          } else {
            return "";
          }
        },
        axisLabel: "Time",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: 'Verdana, Arial',
        axisLabelPadding: 10
      },
      legend: { show: true, position: "nw" }
    });

    function update() {
      get_data();
      plot.setData([usr, sys, idle]);
      plot.setupGrid();
      plot.draw();
      setTimeout(update, updateInterval);
    }
    update();

  })();
});
