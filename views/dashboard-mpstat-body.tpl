% rebase("bootstrap-base.tpl",title="easy_perfmon.py")
% include("dashboard-header.tpl", navbar_brand="easy_perfmon.py: mpstat")

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
        %include("dashboard-sidebar.tpl", current="mpstat")
        </div> <!-- /row/sidebar -->
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <h1 class="page-header">Dashboard: mpstat</h1>

          <div class="row placeholders">
            %for i in range(server_resource["num_of_cpus"]+1):
              %if i == 0:
                <div class="col-xs-12 col-sm-12 placeholder">
                  <table style="margin: 0 auto">                                                                             
              %else:
                <div class="col-xs-4 col-sm-4 placeholder">
                  <table>                                                                             
              %end
                    <tr>                                                                               
                      <td> <span class="caption-usr">%usr</span> </td>                                 
                      <td> <span class="caption-sys">%sys</span> </td>                                 
                      <td> <span class="caption-iowait">%iowait</span> </td>                           
                      <td> <span class="caption-irq">%irq</span> </td>                                 
                    </tr>                                                                              
                  </table>             
                  <canvas id="mpstat{{i}}" class="center-block img-responsive"></canvas>  
                  %if i == 0:
                    <h4>mpstat all</h4>
                  %else:
                    <h4>mpstat core{{i-1}}</h4>
                  %end 
                  <span class="text-muted"></span>
                </div> <!-- /row/col-xs -->
            %end
          </div> <!-- /row_placeholder -->
<!--          <h2 class="sub-header">Section title</h2> -->
<!--          <div class="table-responsive"> -->
<!--            <table class="table table-striped"> -->
<!--              <thead> -->
<!--                <tr> -->
<!--                  <th>#</th> -->
<!--                  <th>Header</th> -->
<!--                  <th>Header</th> -->
<!--                  <th>Header</th> -->
<!--                  <th>Header</th> -->
<!--                </tr> -->
<!--              </thead> -->
<!--              <tbody> -->
<!--                <tr> -->
<!--                  <td>1,001</td> -->
<!--                  <td>Lorem</td> -->
<!--                  <td>ipsum</td> -->
<!--                  <td>dolor</td> -->
<!--                  <td>sit</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,002</td> -->
<!--                  <td>amet</td> -->
<!--                  <td>consectetur</td> -->
<!--                  <td>adipiscing</td> -->
<!--                  <td>elit</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,003</td> -->
<!--                  <td>Integer</td> -->
<!--                  <td>nec</td> -->
<!--                  <td>odio</td> -->
<!--                  <td>Praesent</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,003</td> -->
<!--                  <td>libero</td> -->
<!--                  <td>Sed</td> -->
<!--                  <td>cursus</td> -->
<!--                  <td>ante</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,004</td> -->
<!--                  <td>dapibus</td> -->
<!--                  <td>diam</td> -->
<!--                  <td>Sed</td> -->
<!--                  <td>nisi</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,005</td> -->
<!--                  <td>Nulla</td> -->
<!--                  <td>quis</td> -->
<!--                  <td>sem</td> -->
<!--                  <td>at</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,006</td> -->
<!--                  <td>nibh</td> -->
<!--                  <td>elementum</td> -->
<!--                  <td>imperdiet</td> -->
<!--                  <td>Duis</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,007</td> -->
<!--                  <td>sagittis</td> -->
<!--                  <td>ipsum</td> -->
<!--                  <td>Praesent</td> -->
<!--                  <td>mauris</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,008</td> -->
<!--                  <td>Fusce</td> -->
<!--                  <td>nec</td> -->
<!--                  <td>tellus</td> -->
<!--                  <td>sed</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,009</td> -->
<!--                  <td>augue</td> -->
<!--                  <td>semper</td> -->
<!--                  <td>porta</td> -->
<!--                  <td>Mauris</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,010</td> -->
<!--                  <td>massa</td> -->
<!--                  <td>Vestibulum</td> -->
<!--                  <td>lacinia</td> -->
<!--                  <td>arcu</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,011</td> -->
<!--                  <td>eget</td> -->
<!--                  <td>nulla</td> -->
<!--                  <td>Class</td> -->
<!--                  <td>aptent</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,012</td> -->
<!--                  <td>taciti</td> -->
<!--                  <td>sociosqu</td> -->
<!--                  <td>ad</td> -->
<!--                  <td>litora</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,013</td> -->
<!--                  <td>torquent</td> -->
<!--                  <td>per</td> -->
<!--                  <td>conubia</td> -->
<!--                  <td>nostra</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,014</td> -->
<!--                  <td>per</td> -->
<!--                  <td>inceptos</td> -->
<!--                  <td>himenaeos</td> -->
<!--                  <td>Curabitur</td> -->
<!--                </tr> -->
<!--                <tr> -->
<!--                  <td>1,015</td> -->
<!--                  <td>sodales</td> -->
<!--                  <td>ligula</td> -->
<!--                  <td>in</td> -->
<!--                  <td>libero</td> -->
<!--                </tr> -->
<!--              </tbody> -->
<!--            </table> -->
<!--          </div> -->
        </div>
      </div>
    </div>

    <script type="text/javascript" src="static/js/jquery-2.1.4.min.js"></script>     
    <script type="text/javascript" src="static/js/smoothie.js"></script>   
    <script type="text/javascript" src="static/js/sysmon_mpstat.js"></script>   


