FROM node:18.17.1

ENV NODE_ENV=production

ENV HOST 0.0.0.0

RUN mkdir -p /nuxt3

COPY ./ . /nuxt3/

WORKDIR /nuxt3

EXPOSE 3000

CMD ["node","./.output/server/index.mjs"]