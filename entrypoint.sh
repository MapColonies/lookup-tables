#!/bin/sh

printenv
echo cloning from repo $CLASSIFIED_REPO_URL
whoami

CLASSIFIED_REPO_PATH=./static-assets

git clone $CLASSIFIED_REPO_URL . \
cp -r $CLASSIFIED_REPO_PATH/src/lookup-tables/. /app/dist/assets

cd /
cd /app
echo "Running start command"
exec "$@"