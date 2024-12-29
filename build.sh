

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


$pkg run $client build &
$pkg run $server build &

$pkg run $client start &
$pkg run $server start &

sleep 6
caddy run &

wait

