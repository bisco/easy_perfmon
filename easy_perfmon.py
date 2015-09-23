from bottle import route, run, template, response, view, static_file

import sys
import os
import re
import subprocess

VERSION = "0.1"


def get_num_of_cpus():
    return int(subprocess.check_output("grep -c processor /proc/cpuinfo".strip().split(" ")))

def get_memsize():
    meminfo = subprocess.check_output("grep MemTotal /proc/meminfo".strip().split(" "))
    return int(re.sub(r' +', r' ', meminfo).split(" ")[1])
    

@route('/')
#@view("monitor")
@view("dashboard-index-body")
def index():
    server_resource = {}
    server_resource["num_of_cpus"] = get_num_of_cpus()
    return dict(server_resource=server_resource)


@route("/static/<filepath:path>")
def static(filepath):
    return static_file(filepath,root="./static")


@route('/json/version')
def version():
    response.content_type = "application/json"
    return {"version": VERSION}

@route('/json/num_of_cpus')
def num_of_cpus():
    return {"num_of_cpus": get_num_of_cpus()}


@route('/json/memsize')
def num_of_cpus():
    return {"memsize": get_memsize()}



MPSTAT_FORMAT = ("time", "cpuid", "%usr", "%nice", "%sys", "%iowait", "%irq", 
                 "%soft", "%steal", "%guest", "%gnice", "%idle",) 
@route('/json/mpstat')
def mpstat():
    os.environ["LANG"] = "C"
    response.content_type = "application/json"
    json = {}
    mpstat_result = subprocess.check_output("mpstat -P ALL 1 1".strip().split(" "))

    for i in mpstat_result.split("\n"):
        line = re.sub(r' +', r' ', i).strip().split(" ")
        if len(line) != len(MPSTAT_FORMAT) or line[1] == "CPU":
            continue
        elif line[0].find("Average") >= 0:
            continue
        else:
            json[line[1]] = {}
            for name, value in zip(MPSTAT_FORMAT, line):
                if name == MPSTAT_FORMAT[1]:
                    continue
                json[line[1]][name] = value
    return json


IOSTAT_FORMAT = ('Device', 'rrqm/s', 'wrqm/s', 'r/s', 'w/s', 'rkB/s', 'wkB/s', 'avgrq-sz',
                 'avgqu-sz', 'await', 'r_await', 'w_await', 'svctm', '%util', )
@route('/json/iostat')
def iostat():
    os.environ["LANG"] = "C"
    response.content_type = "application/json"
    json = {}
    iostat_result = subprocess.check_output("iostat -x 1 2".strip().split(" "))

    for i in iostat_result.split("\n"):
        line = re.sub(r' +', r' ', i).replace(":","").strip().split(" ")
        if len(line) != len(IOSTAT_FORMAT) or line[0] == "Device":
            continue
        else:
            if line[0] not in json.keys():
                json[line[0]] = {}
                continue
            for name, value in zip(IOSTAT_FORMAT, line):
                if name == IOSTAT_FORMAT[0]:
                    continue
                json[line[0]][name] = value
    return json


CPUFREQ_FORMAT = ('time', 'cpuid', 'freq',)
@route('/json/cpufreq')
def cpufreq():
    os.environ["LANG"] = "C"
    response.content_type = "application/json"
    json = {}
    p = subprocess.Popen("sar -m CPU -P ALL 1 1", shell=True, 
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    cpufreq_result = p.stdout.read()
    
    for i in cpufreq_result.split("\n"):
        line = re.sub(r' +', r' ', i).strip().split(" ")
        if len(line) != len(CPUFREQ_FORMAT) or line[1] == "CPU":
            continue
        else:
            json[line[1]] = {}
            for name, value in zip(CPUFREQ_FORMAT, line):
                if name == CPUFREQ_FORMAT[1]:
                    continue
                json[line[1]][name] = value
    return json


VMSTAT_FORMAT = ('r','b', 'swpd', 'free', 'buff', 'cache', 'si', 'so',
                 'bi', 'bo', 'in', 'cs', 'us', 'sy', 'id', 'wa', 'st')
@route('/json/vmstat')
def vmstat():
    os.environ["LANG"] = "C"
    response.content_type = "application/json"
    json = {}
    vmstat_result = subprocess.check_output("vmstat".strip().split(" "))
    
    for i in vmstat_result.split("\n"):
        line = re.sub(r' +', r' ', i).strip().split(" ")
        if len(line) != len(VMSTAT_FORMAT) or line[0] == "r":
            continue
        else:
            for name, value in zip(VMSTAT_FORMAT[0:8], line):
                json[name] = value
    return json


def main():
    if len(sys.argv) != 2:
        port = 8080
    else:
        port = int(sys.argv[1])
    run(host='0.0.0.0', port=port)


main()
