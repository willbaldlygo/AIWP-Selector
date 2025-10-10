#!/bin/zsh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

osascript <<EOF
set scriptDir to "$SCRIPT_DIR"
tell application "Terminal"
  activate
  do script "cd " & quoted form of scriptDir & " && npm run dev"
end tell
EOF
