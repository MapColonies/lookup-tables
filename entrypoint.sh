#!/bin/sh

whoami

cd /app
echo "Running start command"
exec "$@"