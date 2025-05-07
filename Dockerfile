FROM node:18 as build

RUN apk add dumb-init

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY . /app
RUN npm run build

ENV NODE_ENV=production

COPY ./entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

USER node
EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]
CMD ["dumb-init", "node", "--max_old_space_size=512", "--import", "./dist/instrumentation.mjs", "./dist/index.js"]
