% rebase("bootstrap-base.tpl",title="easy_perfmon.py")
% include("dashboard-header.tpl", navbar_brand="easy_perfmon.py: system overview")

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
		%include("dashboard-sidebar.tpl", current="Overview")
        </div> <!-- /row/sidebar -->
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <h1 class="page-header">System overview of {{server_resource["hostname"] or "no name"}}</h1>

          <div class="row placeholders">
            <div class="col-xs-4 col-sm-4 placeholder">
              <table>                                                                              
                <tr>                                                                               
                  <td> <span class="caption-usr">%usr</span> </td>                                 
                  <td> <span class="caption-sys">%sys</span> </td>                                 
                  <td> <span class="caption-iowait">%iowait</span> </td>                           
                  <td> <span class="caption-irq">%irq</span> </td>                                 
                </tr>                                                                              
              </table>                                                                             
              <canvas id="mpstat_all" class="img-responsive"></canvas>  
              <h4>mpstat</h4>
              <span class="text-muted"></span>
            </div>
            <div class="col-xs-4 col-sm-4 placeholder center-block">
              <table>                                                                              
			   <tr>                                                                                    
			     <td> <span class="caption-usr">rkB/s</span> </td>                                     
			     <td> <span class="caption-sys">wkB/s</span> </td>                                     
			   </tr>                                                                                   
			  </table>                                                                                  
			  <canvas id="iostat_all" class="img-responsive"></canvas>                                                         
              <h4>iostat</h4>
              <span class="text-muted"></span>
            </div>
            <div class="col-xs-4 col-sm-4 placeholder center-block">
              <table>                                                                              
			   <tr>                                                         
			     <td> <span class="caption-usr">swpd</span> </td>          
			     <td> <span class="caption-sys">free</span> </td>          
                 <td> <span class="caption-iowait">buff</span> </td>                           
                 <td> <span class="caption-irq">cache</span> </td>                                 
			   </tr>                                                        
			  </table>                                                      
			  <canvas id="vmstat_all" class="img-responsive"></canvas>                             
              <h4>vmstat</h4>
              <span class="text-muted">size: kB</span>
            </div>
          </div>

          <h2 class="sub-header">Server information</h2>
          <div class="table-responsive">
            <table class="table table-striped">
              <!-- <thead> -->
              <!--   <tr> -->
              <!--     <th>#</th> -->
              <!--     <th>Header</th> -->
              <!--     <th>Header</th> -->
              <!--     <th>Header</th> -->
              <!--     <th>Header</th> -->
              <!--   </tr> -->
              <!-- </thead> -->
              <tbody>
                <tr>
                  <td>hostname</td>
                  <td>{{server_resource["hostname"]}}</td>
                </tr>
                <tr>
                  <td>kernel version</td>
                  <td>{{server_resource["kernel_ver"]}}</td>
                </tr>
                <tr>
                  <td>CPU model</td>
                  <td>{{server_resource["cpu_model"]}}</td>
                </tr>
                <tr>
                  <td>CPU cores</td>
                  <td>{{server_resource["num_of_cpus"]}}</td>
                </tr>
                <tr>
                  <td>Memory</td>
                  <td>{{server_resource["memsize"]}} kB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <script type="text/javascript" src="static/js/jquery-2.1.4.min.js"></script>     
    <script type="text/javascript" src="static/js/smoothie.js"></script>   
    <script type="text/javascript" src="static/js/sysmon_main.js"></script>   


