#!/usr/bin/env bash
# Railpack / Railway may look for start.sh at the service root.
exec "$(dirname "$0")/scripts/start.sh"
