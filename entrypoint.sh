#!/bin/sh

printenv

echo cloning from repo $CLASSIFIED_REPO_URL

whoami

CLASSIFIED_REPO_PATH='/app/classified_assets'
cd $CLASSIFIED_REPO_PATH

git clone $CLASSIFIED_REPO_URL .

\cp -r $CLASSIFIED_REPO_PATH/src/lookup-tables/. /app/classified_assets/

\cp -r /app/classified_assets/. /app/dist/assets/

cd /app
echo "Running start command"
exec "$@"