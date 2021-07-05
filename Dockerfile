FROM node:12.14-alpine

LABEL maintainer="thedv91@gmail.com"

EXPOSE 3000

ENV NODE_ENV development

WORKDIR /home/node

COPY . /home/node

RUN yarn install --pure-lockfile

RUN yarn build

CMD ["node", "dist/main.js"]
