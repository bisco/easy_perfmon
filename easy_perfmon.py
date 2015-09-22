from bottle import route, run, template, response, view, static_file

import sys
import os
import re
import subprocess

VERSION = "0.1"

@route('/')
@view("monitor")
def index():
    init()
    return

def init():
    os.environ["LANG"] = "C"


@route("/static/<filepath:path>")
def static(filepath):
    return static_file(filepath,root="./static")

@route('/json/version')
def version():
    response.content_type = "application/json"
    return {"version": VERSION}


MPSTAT_FORMAT = ("time", "cpuid", "%usr", "%nice", "%sys", "%iowait", "%irq", 
                 "%soft", "%steal", "%guest", "%gnice", "%idle",) 
@route('/json/mpstat')
def mpstat():
    response.content_type = "application/json"
    json = {}
    mpstat_result = subprocess.check_output("mpstat -P ALL".strip().split(" "))

    for i in mpstat_result.split("\n"):
        line = re.sub(r' +', r' ', i).strip().split(" ")
        if len(line) != len(MPSTAT_FORMAT) or line[1] == "CPU":
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
    response.content_type = "application/json"
    json = {}
    iostat_result = subprocess.check_output("iostat -x".strip().split(" "))

    for i in iostat_result.split("\n"):
        line = re.sub(r' +', r' ', i).replace(":","").strip().split(" ")
        if len(line) != len(IOSTAT_FORMAT) or line[0] == "Device":
            continue
        else:
            json[line[0]] = {}
            for name, value in zip(IOSTAT_FORMAT, line):
                if name == IOSTAT_FORMAT[0]:
                    continue
                json[line[0]][name] = value
    return json


CPUFREQ_FORMAT = ('time', 'cpuid', 'freq',)
@route('/json/cpufreq')
def iostat():
    response.content_type = "application/json"
    json = {}
    p = subprocess.Popen("sar -m CPU -P ALL 0", shell=True, 
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
def iostat():
    response.content_type = "application/json"
    json = {}
    vmstat_result = subprocess.check_output("vmstat".strip().split(" "))

    
    for i in vmstat_result.split("\n"):
        line = re.sub(r' +', r' ', i).strip().split(" ")
        print line
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
