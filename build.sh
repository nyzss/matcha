#!/bin/bash

# Running for prod

# check if .env file exists and export its content
[ ! -f .env ] || export $(grep -v '^#' .env | xargs)

export NODE_ENV=production

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

$pkg install -P false $client &
$pkg install -P false $server &

docker compose up -d db --build &

sleep 3
$pkg run $client build
$pkg run $server start &

sleep 3

caddy run -c ./prod/Caddyfile &

wait
docker compose down