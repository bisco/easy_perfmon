#!/bin/bash

# constant parameter
PROGNAME=$(basename $0)
VERSION="0.1"

# default parameter
BASE_DIR="~/get_log/"
INTERVAL_SEC=1
DEBUG=0

usage() {
    echo "Usage: $PROGNAME [OPTIONS]"
    echo "  This script gathers performance data."
    echo
    echo "Options:"
    echo "  -h, --help"
    echo "      --version"
    echo "  -v, --debug (debug mode)"
    echo "  -n, --test-name       NAME    (mandatory)"
    echo "  -t, --duration        SECONDS (mandatory)"
    echo "  -o, --output-base-dir DIRNAME (option: default output base dir is ~/get_log/)"
    exit 1
}

ps_background() {
    for ((i=0; i<$DURATION; i+=$INTERVAL_SEC))
    do
        ps -aeo pid,tid,uname,class,rtprio,ni,psr,pcpu,pmem,stat,wchan:32,args >> ps_aeo
    done
}


for OPT in "$@"
do
    case "$OPT" in 
        '-h'|'--help' )
            usage
            exit 1
            ;;
        '--version' )
            echo $VERSION
            exit 1
            ;;
        '-v'|'--debug' )
            DEBUG=1
            shift 1
            ;;
        '-n'|'--test-name' )
            if [[ -z "$2" ]] || [[ "$2" =~ ^-+ ]]; then
                echo "$PROGNAME: option requires an argument -- $1" 1>&2
                exit 1
            fi
            TESTNAME=$2
            shift 2
            ;;
        '-t'|'--duration' )
            if [[ -z "$2" ]] || [[ "$2" =~ ^-+ ]]; then
                echo "$PROGNAME: option requires an argument -- $1" 1>&2
                exit 1
            fi
            DURATION=$2
            shift 2
            ;;
        '-o'|'--output-dir' )
            if [[ -z "$2" ]] || [[ "$2" =~ ^-+ ]]; then
                echo "$PROGNAME: option requires an argument -- $1" 1>&2
                exit 1
            fi
            BASE_DIR=$2
            shift 2
            ;;
        '--'|'-' )
            shift 1
            param+=( "$@" )
            break
            ;;
        -*)
            echo "$PROGNAME: illegal option -- '$(echo $1 | sed 's/^-*//')'" 1>&2
            exit 1
            ;;
        *)
            if [[ ! -z "$1" ]] && [[ ! "$1" =~ ^-+ ]]; then
                param+=( "$1" )
                shift 1
            fi
            ;;
    esac
done


if [ -z '$param' ]; then
    echo "$PROGNAME: too few arguments" 1>&2
    echo "Try '$PROGNAME --help' for more information." 1>&2
    exit 1
fi

if [ -z $DURATION ]; then
    echo "$PROGNAME: too few arguments" 1>&2
    echo "Try '$PROGNAME --help' for more information." 1>&2
    echo "You must specify the duration with option '-t(--duration)'" 1>&2
    exit 1
fi

TS=`date +"%Y%m%d-%H%M%S"`

if [ $DEBUG -eq 1 ]; then
    echo "   Version: "$VERSION
    echo "Time Stamp: "$TS
    echo " Test Name: "$TESTNAME
    echo "  Duration: "$DURATION
    echo "  Base Dir: "$BASE_DIR
fi

if [ ! -e $BASE_DIR ]; then
    mkdir -p $BASE_DIR
fi

cd $BASE_DIR
OUTPUT_DIR=$TS"_"$TESTNAME
mkdir $OUTPUT_DIR
cd $OUTPUT_DIR

if [ $DEBUG -eq 1 ]; then
    echo "Start gathering information..."
    echo "Running commands:"
    echo "    sar -o sar_data"
    echo "    mpstat -A"
    echo "    iostat -x -t"
    echo "    pidstat -l -d"
    echo "    ps -aeo pid,tid,uname,class,rtprio,ni,psr,pcpu,pmem,stat,wchan:32,args"
fi
(sar -o sar_data $INTERVAL_SEC $DURATION 2>/dev/null 1>/dev/null)&
(iostat -x -t    $INTERVAL_SEC $DURATION 2>&1 >iostat )&
(mpstat -A       $INTERVAL_SEC $DURATION 2>&1 >mpstat )&
(pidstat -l -d   $INTERVAL_SEC $DURATION 2>&1 >pidstat)&
(ps_background)&

wait
