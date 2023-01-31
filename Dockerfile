FROM node:18-bullseye-slim

COPY . /app
WORKDIR /app

RUN adduser hertz --disabled-password \
    && chown -R hertz /app

USER hertz

RUN npm install

CMD ["node", "index.js"]