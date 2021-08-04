FROM node:lts
ENV NODE_ENV production
WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY build .
CMD ["npm", "run", "prod"]
