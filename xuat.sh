#!/bin/bash
# Usage: ./xuat.sh <story-folder> [say]   Narrates, records and muxes one story into its mp4.
# "say" narrates with the built-in macOS voice, for days when the online voice refuses requests.
set -euo pipefail
cd "$(dirname "$0")"
if [ -f .env ]; then set -a; . ./.env; set +a; fi

dir=${1:?usage: ./xuat.sh <story-folder> [say]}
dir=${dir%/}
[ -f "$dir/xuat/quay.js" ] || { echo "not a story folder: $dir" >&2; exit 1; }

node doc.js "$dir" ${2:+"$2"}
node nhac.js "$dir"

python3 -m http.server 8765 --bind 127.0.0.1 --directory "$dir" >/dev/null 2>&1 &
server=$!
trap 'kill "$server" 2>/dev/null || true' EXIT
sleep 1
# a server left over from another run would serve the wrong story
kill -0 "$server" 2>/dev/null || { echo "port 8765 is in use" >&2; exit 1; }

node "$dir/xuat/quay.js"
node "$dir/xuat/ghep.js"
node kiem.js "$dir"
