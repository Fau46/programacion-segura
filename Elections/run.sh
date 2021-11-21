#!/bin/sh
export PYTHONPATH="."
case "$1" in
    "setup")
        pip3 install -r requirements.txt
        ;;
    "docker-build")
        docker build . -t service
        ;;
    "-d")
        python3 src/app.py
        ;;
    "docker")
        if [ -z "$2" ] 
        then
            docker run -it -p 8080:8080 service 
        else
            docker run -it -p 8080:8080 -e "CONFIG=$2" service
        fi
        ;;
    *)
        python3 src/app.py "$1"
        ;;
esac