#!/bin/sh

echo cloning from repo $CLASSIFIED_REPO_URL

whoami
CLASSIFIED_REPO='/app/classified_repo'
CLASSIFIED_REPO_PATH='/app/classified_repo'
cd $CLASSIFIED_REPO_PATH

git clone $CLASSIFIED_REPO_URL .
echo "Finish clone..."

\cp -r $CLASSIFIED_REPO_PATH/src/lookup-tables/. /app/classified_repo/
echo "Finish first copy..."

\cp -r /app/classified_repo/. /app/dist/assets/
echo "Finish second copy..."

cd /app
echo "Running start command"
exec "$@"