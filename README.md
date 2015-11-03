# easy_perfmon

## About
easy_perfmon is a simple system monitor for Linux
written by Javascript.

easy_perfmon shows server status below in real time:
- cpu usage(system average): %usr, %sys, %idle, %nice, %iowait, %irq, %softirq
- load average: 1min average, 5min average, 15min average(not on index page)
- disk throughput(system total): Read Byte/s(rB/s), Write Byte/s(wB/s)
- network throughput: recv(Byte/s), send(Byte/s)

## How to install

Install commands are follows:
```bash
$ git clone https://github.com/bisco/easy_perfmon.git
$ npm install
$ bower install
$ grunt bower:install
```


## Usage
start app.js and access your-server-ip:3000 by web browser.

