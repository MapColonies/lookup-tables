FROM node:16 as build

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY . /app
RUN npm run build

ENV NODE_ENV=production

COPY ./entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

RUN mkdir -p ./classified_assets
RUN chmod g+rwx -R ./classified_assets
RUN chgrp -R node ./classified_assets

RUN chmod g+rwx -R ./dist/assets
RUN chgrp -R node ./dist/assets

USER node
EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "--max_old_space_size=512", "./index.js"]
