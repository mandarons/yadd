FROM node:lts-alpine AS build
RUN apk --no-cache --virtual build-dependencies add python make g++
ENV NODE_ENV production
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile --prod

FROM node:lts-alpine
RUN apk update && apk add --no-cache dumb-init curl
ENV NODE_ENV production
USER node
WORKDIR /app
COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node build .
CMD ["dumb-init", "node", "./src/index.js"]
