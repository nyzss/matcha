#!/bin/bash

# FOR DEVELOPMENT PURPOSES ONLY
# RUN `docker compose up --build` for prod (42 evaluation), or not...

# check if .env file exists and export its content
[ ! -f .env ] || export $(grep -v '^#' .env | xargs)

pkg="npm"
dir="--prefix"

# check if pnpm exists
if command -v pnpm &> /dev/null
then
    pkg="pnpm"
    dir="--dir"
fi

server="$dir ./server"
client="$dir ./client"

$pkg install $client &
$pkg install $server &

docker compose up -d db --build &
sleep 3
$pkg run $client dev &
$pkg run $server dev &

sleep 3

caddy run &

sleep 3

$pkg run $server test &

wait
docker compose down