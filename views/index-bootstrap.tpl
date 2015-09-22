% rebase("bootstrap-base.tpl",title="easy_perfmon.py")
% include("bootstrap-header.tpl", navbar_brand="easy_perfmon.py:system summary")

    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron">
      <div class="container">
        <h1>Hello, world!</h1>
        <p>This is a template for a simple marketing or informational website. 
           It includes a large callout called a jumbotron and three supporting pieces of content. 
           Use it as a starting point to create something more unique.</p>
        <!-- <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more &raquo;</a></p> -->
      </div>
    </div>

    <div class="container">
      <!-- Example row of columns -->
      <div class="row">
        <div class="col-md-4">
          <h2>mpstat</h2>
          <table>
            <tr>
              <td> <span class="caption-usr">%usr</span> </td>
              <td> <span class="caption-sys">%sys</span> </td>
              <td> <span class="caption-iowait">%iowait</span> </td>
              <td> <span class="caption-irq">%irq</span> </td>
            </tr>
          </table>
          <canvas id="mpstat_all"></canvas>
          <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
        </div>
        <div class="col-md-4">
          <h2>iostat</h2>
           <table>
            <tr>
              <td> <span class="caption-usr">rkB/s</span> </td>
              <td> <span class="caption-sys">wkB/s</span> </td>
            </tr>
          </table>
          <canvas id="iostat_all"></canvas>
      </div>
        <div class="col-md-4">
          <h2>vmstat</h2>
          <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
          <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
        </div>
      </div> <!-- /container/row -->

      <hr>

      <footer>
        <p>&copy; bisco 2015</p>
      </footer>
    </div> <!-- /container -->

    <script type="text/javascript" src="static/jquery-2.1.4.min.js"></script>     
    <script type="text/javascript" src="static/smoothie.js"></script>   
    <script type="text/javascript" src="static/sysmon_main.js"></script>   


