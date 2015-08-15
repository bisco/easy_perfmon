#!/bin/bash

# constant parameter
PROGNAME=$(basename $0)
VERSION="0.2"

# default parameter
BASE_DIR="~/get_log/"
REMOTE_BASE_DIR="~/get_log/"
INTERVAL_SEC=1
DEBUG=0
SSH_PORT=22
REMOTE_SCRIPT_PATH="~/get_log.sh"

usage() {
    echo "Usage: $PROGNAME [OPTIONS]"
    echo "  This script gathers performance data."
    echo
    echo "Options:"
    echo "  -h, --help"
    echo "      --version"
    echo "  -v, --debug (debug mode)"
    echo "  -n, --test-name       NAME (mandatory)"
    echo "  -t, --duration        SECONDS (mandatory)"
    echo "  -o, --output-base-dir DIRNAME (option: default output base dir is ~/get_log/)"
    echo "  -r, --remote-host     IP|HOSTNAME (GET_LOG_SCRIPT_PATH) (REMOTE_BASE_DIR)"
    echo "                        (option: default GET_LOG_SCRIPT_PATH is ~/get_log.sh)"
    echo "                        (option: default REMOTE_BASE_DIR is ~/get_log/)"
    echo "  -p, --ssh-port        PORT"
    exit 1
}

ps_background() {
    for ((i=0; i<$DURATION; i+=$INTERVAL_SEC))
    do
        ps -aeo pid,tid,uname,class,rtprio,ni,psr,pcpu,pmem,stat,wchan:32,args >> ps_aeo
    done
}

remote_get_log() {
    local TESTNAME=$1
    local DURATION=$2
    local OUTPUT_DIR=$3
    local SCRIPT_PATH=$4
    local SSH_PORT=$5
    ssh -p $SSH_PORT $REMOTE_HOST "$SCRIPT_PATH -n $TESTNAME -t $DURATION -o $OUTPUT_DIR"
    SCP_DIRNAME=`ssh -p $SSH_PORT $REMOTE_HOST "ls -lshrt $OUTPUT_DIR" | tail -n 1 | awk '{print $NF}'`
    scp -P $SSH_PORT -r $REMOTE_HOST:$OUTPUT_DIR/$SCP_DIRNAME .
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
        '-r'|'--remote-host' )
            if [[ -z "$3" ]] || [[ "$3" =~ ^-+ ]]; then
                echo "$PROGNAME: option requires an argument -- $1" 1>&2
                exit 1
            fi
            REMOTE_HOST=$2
            REMOTE_SCRIPT_PATH=$3
            if [[ ! -z "$4" ]] || [[ ! "$4" =~ ^-+ ]]; then
                REMOTE_BASE_DIR=$4
                shift 4
            else
                shift 3
            fi
            ;;
        '-p'|'--ssh-port' )
            if [[ -z "$2" ]] || [[ "$2" =~ ^-+ ]]; then
                echo "$PROGNAME: option requires an argument -- $1" 1>&2
                exit 1
            fi
            SSH_PORT=$2
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


TS=`date +"%Y%m%d-%H%M%S"`

if [ $DEBUG -eq 1 ]; then
    echo "Version: "$VERSION
    echo "Time Stamp: "$TS
    echo "Test Name: "$TESTNAME
    echo "Duration: "$DURATION
    echo "Base Dir: "$BASE_DIR
    echo "Remote Host: "$REMOTE_HOST
    echo "Remote Host Script Path: "$REMOTE_SCRIPT_PATH
    echo "Remote Host Base Dir: "$REMOTE_BASE_DIR
    echo "SSH Port: "$SSH_PORT
fi

if [ -z $DURATION ]; then
    echo "$PROGNAME: too few arguments" 1>&2
    echo "Try '$PROGNAME --help' for more information." 1>&2
    echo "You must specify the duration with option '-t(--duration)'" 1>&2
    exit 1
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

if [[ ! -z "$REMOTE_HOST" ]]; then
    mkdir $REMOTE_HOST
    cd $REMOTE_HOST
    (remote_get_log $TESTNAME $DURATION $REMOTE_BASE_DIR $REMOTE_SCRIPT_PATH $SSH_PORT)&
fi

wait
