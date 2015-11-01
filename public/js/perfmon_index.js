$(function(){
  (function(){
    // We use an inline data source in the example, usually data would
    // be fetched from a server
    var usr = [], nice = [], sys = [], idle = [],
        iowait = [], irq = [], softirq = [];
    var d_rBs = [], d_wBs = [];
    var n_rBs = [], n_wBs = [];
    var plots = [];
    var placeholders = ["#mpstat_total", "#diskstat_total", "#netstat_total"];
    var leg_placeholders = ["#mpstat_legend", "#diskstat_legend", "#netstat_legend"];
    var _TOTAL_POINTS = 60;

    function get_json(url, data_ary, keys) {
      $.getJSON(
        url,
        function(json) {
          var t = (new Date()).getTime();
          for(var i=0; i<data_ary.length; i++) {
            if(data_ary[i].length > _TOTAL_POINTS) {
              data_ary[i].shift();
            }
            data_ary[i].push([t, json[keys[i]]]);
          }
        }
      );
    }

    function get_data() {
      get_json("json/mpstat_total", [usr, nice, sys, idle, iowait, irq, softirq], 
                                    ["user", "nice", "system", "idle", "iowait", "irq", "softirq"]);
      get_json("json/diskstat_total", [d_rBs, d_wBs], ["rbytes_s", "wbytes_s"]);
      get_json("json/netstat_total", [n_rBs, n_wBs], ["rbytes_s", "wbytes_s"]);
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

    // options
    function gen_base_options() {
      var base_option = {
        legend: { show: true, position: "nw"},
        series: { shadowSize: 0 },
        yaxis: {
          min: 0,
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
        }
      };
      return base_option;
    }

    var options = [gen_base_options(), gen_base_options(), gen_base_options()];
    options[0]["yaxis"]["axisLabel"] = "CPU usage";
    options[0]["yaxis"]["max"] = 100;
    options[0]["yaxis"]["min"] = 0;
    options[0]["yaxis"]["tickFormatter"] = 
      function (v, axis) {
        if (v % 10 == 0) {
          return v + "%";
        } else {
          return "";
        }
      };
    options[0]["legend"]["container"] = leg_placeholders[0];
    options[0]["legend"]["noColumns"] = 8;
    options[0]["series"]["stack"] = true;
    options[0]["series"]["lines"] = {fill: true};

    options[1]["yaxis"]["axisLabel"] = "Disk I/O";
    options[1]["legend"]["container"] = leg_placeholders[1];
    options[1]["legend"]["noColumns"] = 2;
    options[2]["yaxis"]["axisLabel"] = "Network I/O";
    options[2]["legend"]["container"] = leg_placeholders[2];
    options[2]["legend"]["noColumns"] = 2;

    // Set up plot
    var plots = [];
    plots.push($.plot(placeholders[0], 
          [{label:"usr", data:usr},
           {label:"sys", data:sys},
           {label:"nice", data:nice},
           {label:"idle", data:idle},
           {label:"iowait", data:irq},
           {label:"iowait", data:softirq}
           ], options[0]));
    plots.push($.plot(placeholders[1], 
          [{label:"rB/s",data:d_rBs},{label:"wB/s",data:d_wBs}], options[1]));
    plots.push($.plot(placeholders[2], 
          [{label:"recv(B/s)",data:n_rBs},{label:"send(B/s)",data:n_wBs}], options[2]));

    function update() {
      get_data();
      plots[0].setData(
          [{label:"usr", data:usr},
           {label:"sys", data:sys},
           {label:"nice", data:nice},
           {label:"idle", data:idle},
           {label:"iowait", data:iowait},
           {label:"irq", data:irq},
           {label:"softirq", data:softirq}
           ]);
      plots[1].setData([{label:"rB/s", data: d_rBs}, {label:"wB/s", data:d_wBs}]);
      plots[2].setData([{label:"recv(B/s)", data:n_rBs}, {label:"send(B/s)", data:n_wBs}]);
      for(var i=0;i<plots.length; i++) {
        plots[i].setupGrid();
        plots[i].draw();
      }
      setTimeout(update, updateInterval);
    }
    update();

  })();
});
