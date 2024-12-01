#!/bin/bash

# FOR DEVELOPMENT PURPOSES ONLY
# RUN `docker compose up --build` for prod (42 evaluation), or not...

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

docker compose up db --build &
$pkg run $client dev &
$pkg run $server dev &

wait
wait