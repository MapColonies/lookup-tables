#!/bin/sh

printenv

echo cloning from repo https://github.com/MapColonies/static-assets

whoami

CLASSIFIED_REPO_PATH='/app/classified_repo'
cd $CLASSIFIED_REPO_PATH

git clone https://github.com/MapColonies/static-assets .

\cp -r $CLASSIFIED_REPO_PATH/src/lookup-tables/. /app/classified_repo/

\cp -r /app/classified_repo/. /app/dist/assets/

cd /app
echo "Running start command"
exec "$@"