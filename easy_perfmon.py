from bottle import route, run, template, response, view, static_file
import re

VERSION = "0.1"
PROC_STAT = "/proc/stat"
CPU_COLUMN_NAME = ("user","nice", "system", "idle", "iowait", "irq", "softirq", 
                   "steal", "guest", "guest_nice")

@route('/')
@view("monitor")
def index():
    return

@route("/static/<filepath:path>")
def static(filepath):
    return static_file(filepath,root="./static")

@route('/json/version')
def version():
    response.content_type = "application/json"
    return {"version": VERSION}

@route('/json/cpu_usage')
def cpu_usage():
    response.content_type = "application/json"
    json = {}
    with open(PROC_STAT, "r") as f:
        for line in f:
            l = re.sub(r' +',r' ',line).strip().split(" ")
            if l[0][0:3] != "cpu":
                break
            
            if len(l[0]) == 3: #total
                key = "total"
            else:
                key = l[0]
            json[key] = {}

            total = 0L
            for col,val in zip(CPU_COLUMN_NAME,l[1:]):
                json[key][col] = long(val)
                total += long(val)

            for i, _ in json[key].items():
                json[key][i] = "%.2f"%(100.0 * ((float)(json[key][i])/total))
    return json

run(host='0.0.0.0', port=8080)

