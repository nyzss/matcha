#!/bin/bash

# FOR DEVELOPMENT PURPOSES ONLY
# RUN `docker compose up --build` for prod (42 evaluation), or not...

# check if .env file exists and export its content
[ ! -f .env ] || export $(grep -v '^#' .env | xargs)

pkg="npm"
dir="--prefix"
output=0

# check if pnpm exists
if command -v pnpm &> /dev/null
then
    pkg="pnpm"
    dir="--dir"
fi

server="$dir ./server"

$pkg install $server

docker compose up -d db --build
sleep 3

$pkg run $server build
$pkg run $server test:local
output=$?

docker compose down

exit $output