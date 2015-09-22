<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
      body {
        background-color: #111111;
        color: #eeeeee;
        font-family: tahoma, arial, sans-serif;
        padding-left: 100px;
      }
      h4 {
        margin-bottom: 1px;
      }
    </style>
    <script type="text/javascript" src="static/jquery.js"></script>
    <script type="text/javascript" src="static/smoothie.js"></script>

    <!--<link rel="stylesheet" type="text/css" href="static/epoch.min.css"> -->
    <!--<script type="text/javascript" src="static/d3.min.js"></script>     -->
    <!--<script type="text/javascript" src="static/epoch.min.js"></script>  -->

    <script type="text/javascript" src="static/server_load.js"></script>
    
  </head>
    <h1>CPU Load</h1>
        %for i in range(server_resource["num_of_cpus"]+1):
            %if i == 0:
                <h4>ALL</h4>
            %else:
                <h4>CPU #{{i}}</h4>
            %end
                <canvas id="mpstat{{i}}" width="500" height="300"></canvas>

        %end
    <!-- <h4>epoch</h4> -->
    <!-- <div id="myarea" class="epoch category10" style="width: 400px;height: 300px;"></div> -->

    <!-- <h4>epoch gauge</h4> -->
    <!-- <div id="gaugeChart" class="epoch gauge-tiny" style="width: 400px; height: 300px"></div> -->

  </body>
</html>

