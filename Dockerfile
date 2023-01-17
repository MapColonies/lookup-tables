FROM node:16 as build

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY . /app
RUN npm run build

ENV NODE_ENV=production

COPY ./entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

RUN mkdir -p ./classified_repo && chown -R :root ./classified_repo && chmod -R g=u ./classified_repo
RUN mkdir -p ./dist/assets && chown -R :root ./dist/assets && chmod -R g=u ./dist/assets

USER node
EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "--max_old_space_size=512", "./index.js"]
