#!/bin/bash

# FOR DEVELOPMENT PURPOSES ONLY
# RUN `docker compose up --build` for prod (42 evaluation)

# mkdir -p
# mkdir -p logs/error

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

$pkg run $client dev &
$pkg run $server dev &
docker compose up --build &

# will use native logger output from backend and frontend

# # helper function for logging
# log_and_execute() {
#     command=$1
#     log_file="logs/$2"
#     error_log_file="logs/$3"

#     {
#         $command > >(tee -a "$log_file") 2> >(tee -a "$error_log_file" >&2)
#     }
# }

# # install packages
# log_and_execute "$pkg install $client" "install/client-install.log" "error/client-install-error.log"
# log_and_execute "$pkg install $server" "install/server-install.log" "error/server-install-error.log"

# # run development servers in parallel
# log_and_execute "$pkg run $client dev" "client.log" "error/client-dev-error.log" &
# log_and_execute "$pkg run $server dev" "server.log" "error/server-dev-error.log" &

wait